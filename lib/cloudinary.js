export function cloudinaryAssetUrl(asset) {
  return asset?._type === "cloudinary.asset" ? asset.secure_url || null : null;
}
