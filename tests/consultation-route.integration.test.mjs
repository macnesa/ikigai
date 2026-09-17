import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import { once } from "node:events";
import { test } from "node:test";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(server.address().port);
    });
  });
}

async function getOpenPort() {
  const server = http.createServer();
  const port = await listen(server);
  server.close();
  await once(server, "close");
  return port;
}

async function waitForApplication(url, processState) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 30_000) {
    if (processState.exited) {
      throw new Error(`Next.js exited before readiness.\n${processState.output}`);
    }

    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Next.js did not become ready.\n${processState.output}`);
}

async function waitForCondition(condition, message) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 3_000) {
    if (condition()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 25));
  }

  throw new Error(message);
}

function createValidSubmission(overrides = {}) {
  return {
    name: "Webhook Test",
    whatsapp: "+62 800-0000-0000",
    propertyType: "Test Villa",
    location: "Test Location",
    interest: "combined",
    timeline: "ASAP / 0-1 month",
    requestType: "Consultation",
    termsAccepted: true,
    marketingConsent: false,
    website: "",
    eventId: "123e4567-e89b-42d3-a456-426614174000",
    ...overrides,
  };
}

test(
  "consultation route requires webhook acceptance and keeps backup delivery best-effort",
  { timeout: 45_000 },
  async () => {
    const webhookRequests = [];
    let resendRequests = 0;
    const webhookServer = http.createServer(async (request, response) => {
      const chunks = [];

      for await (const chunk of request) {
        chunks.push(chunk);
      }

      if (request.url === "/emails") {
        resendRequests += 1;
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({
            name: "application_error",
            message: "Mock Resend failure",
          }),
        );
        return;
      }

      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      webhookRequests.push({ headers: request.headers, body });
      response.statusCode = body.full_name === "HTTP Failure" ? 500 : 204;
      response.end();
    });
    const webhookPort = await listen(webhookServer);
    const applicationPort = await getOpenPort();
    const applicationOrigin = `http://127.0.0.1:${applicationPort}`;
    const processState = { exited: false, output: "" };
    const nextProcess = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(applicationPort),
      ],
      {
        cwd: new URL("..", import.meta.url),
        env: {
          ...process.env,
          LEAD_WEBHOOK_URL: `http://127.0.0.1:${webhookPort}/lead`,
          LEAD_WEBHOOK_TOKEN: "local-test-token",
          RESEND_API_KEY: "local-test-key",
          RESEND_BASE_URL: `http://127.0.0.1:${webhookPort}`,
          CONSULTATION_TO_EMAIL: "sales@example.invalid",
          CONSULTATION_FROM_EMAIL: "IKIGAI <forms@example.invalid>",
          META_DATASET_ID: "",
          META_CAPI_ACCESS_TOKEN: "",
          META_CAPI_TEST_EVENT_CODE: "",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const captureOutput = (chunk) => {
      processState.output = `${processState.output}${chunk}`.slice(-8_000);
    };
    nextProcess.stdout.on("data", captureOutput);
    nextProcess.stderr.on("data", captureOutput);
    nextProcess.once("exit", () => {
      processState.exited = true;
    });

    try {
      await waitForApplication(applicationOrigin, processState);

      const submit = (payload, campaign = "meta_bali_01") =>
        fetch(`${applicationOrigin}/api/consultation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Referer: `${applicationOrigin}/?c=${campaign}`,
          },
          body: JSON.stringify(payload),
        });

      const successfulResponse = await submit(createValidSubmission());
      const successfulBody = await successfulResponse.json();

      assert.equal(successfulResponse.status, 200);
      assert.equal(successfulBody.ok, true);
      assert.equal(successfulBody.accepted, true);
      assert.equal(webhookRequests.length, 1);
      assert.equal(
        webhookRequests[0].headers["x-make-apikey"],
        "local-test-token",
      );
      assert.equal(webhookRequests[0].body.campaign, "meta_bali_01");
      assert.equal(
        webhookRequests[0].body.page_url,
        `${applicationOrigin}/?c=meta_bali_01`,
      );
      assert.equal(webhookRequests[0].body.phone, "+6280000000000");
      assert.equal("website" in webhookRequests[0].body, false);
      await waitForCondition(
        () => resendRequests === 1,
        "Resend backup was not attempted after webhook success.",
      );

      const failedResponse = await submit(
        createValidSubmission({
          name: "HTTP Failure",
          eventId: "223e4567-e89b-42d3-a456-426614174000",
        }),
      );
      const failedBody = await failedResponse.json();

      assert.equal(failedResponse.status, 503);
      assert.equal(failedBody.ok, false);
      assert.notEqual(failedBody.accepted, true);
      assert.equal(webhookRequests.length, 2);
      assert.equal(resendRequests, 1);

      const invalidPhoneResponse = await submit(
        createValidSubmission({
          whatsapp: "081234567890",
          eventId: "323e4567-e89b-42d3-a456-426614174000",
        }),
      );
      const invalidPhoneBody = await invalidPhoneResponse.json();

      assert.equal(invalidPhoneResponse.status, 400);
      assert.equal(
        invalidPhoneBody.errors.whatsapp,
        "Include your country code, e.g. +62...",
      );
      assert.equal(webhookRequests.length, 2);
      assert.equal(resendRequests, 1);

      const honeypotResponse = await submit({ website: "filled-by-bot" });
      const honeypotBody = await honeypotResponse.json();

      assert.equal(honeypotResponse.status, 200);
      assert.equal(honeypotBody.ok, true);
      assert.notEqual(honeypotBody.accepted, true);
      assert.equal(webhookRequests.length, 2);
      assert.equal(resendRequests, 1);

      for (const eventId of [
        "423e4567-e89b-42d3-a456-426614174000",
        "523e4567-e89b-42d3-a456-426614174000",
        "623e4567-e89b-42d3-a456-426614174000",
      ]) {
        const response = await submit(createValidSubmission({ eventId }));
        const body = await response.json();

        assert.equal(response.status, 200);
        assert.equal(body.accepted, true);
      }

      await waitForCondition(
        () => resendRequests === 4,
        "Resend backup attempts did not complete for accepted leads.",
      );
      assert.equal(webhookRequests.length, 5);

      const rateLimitedResponse = await submit(
        createValidSubmission({
          eventId: "723e4567-e89b-42d3-a456-426614174000",
        }),
      );
      const rateLimitedBody = await rateLimitedResponse.json();

      assert.equal(rateLimitedResponse.status, 429);
      assert.equal(rateLimitedBody.ok, false);
      assert.notEqual(rateLimitedBody.accepted, true);
      assert.equal(webhookRequests.length, 5);
      assert.equal(resendRequests, 4);
    } finally {
      const processClosed = processState.exited
        ? Promise.resolve()
        : once(nextProcess, "exit");
      const webhookClosed = webhookServer.listening
        ? once(webhookServer, "close")
        : Promise.resolve();

      if (!processState.exited) {
        nextProcess.kill("SIGTERM");
      }
      webhookServer.close();
      await Promise.allSettled([processClosed, webhookClosed]);
    }
  },
);
