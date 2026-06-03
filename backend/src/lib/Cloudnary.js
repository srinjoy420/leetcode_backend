import "../config/env.js"
import { v2 as cloudinary } from "cloudinary"

const cloudName = (process.env.COULDENARY_CLOUD_NAME || "").trim()
const apiKey = (process.env.CLOUDNARY_API_KEY || "").trim()
const apiSecret = (process.env.CLOUDNARY_API_SECRET || "").trim()

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret)

if (process.env.NODE_ENV === "development") {
    console.log("Cloudinary Config:")
    console.log("Cloud Name:", cloudName || "(missing)")
    console.log("API Key:", apiKey ? `${apiKey.slice(0, 4)}...` : "(missing)")
    console.log(
        "API Secret:",
        apiSecret ? `${apiSecret.slice(0, 5)}*****` : "(missing)"
    )
}

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    })
} else {
    console.warn(
        "[Cloudinary] Missing CLOUDNARY_CLOUD_NAME, CLOUDNARY_API_KEY, or CLOUDNARY_API_SECRET in backend/.env"
    )
}

export async function uploadProfileImage(profilePic) {
    if (!profilePic) {
        throw new Error("profilePic is required")
    }

    if (!isCloudinaryConfigured) {
        throw new Error(
            "Cloudinary is not configured. Add CLOUDNARY_* variables to backend/.env"
        )
    }

    if (profilePic.includes("res.cloudinary.com")) {
        return profilePic
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "leetlab/profile_pics",
            resource_type: "image",
            overwrite: true,
        })
        return uploadResponse.secure_url
    } catch (error) {
        if (error?.http_code === 403) {
            throw new Error(
                "Cloudinary rejected the upload (403). Use the Root API key/secret or enable Upload on your API key in Cloudinary Console → Settings → API Keys."
            )
        }
        throw error
    }
}

export async function verifyCloudinaryCredentials() {
    if (!isCloudinaryConfigured) {
        return { ok: false, reason: "missing_env" }
    }

    try {
        const tinyPng =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

        await cloudinary.uploader.upload(tinyPng, {
            folder: "leetlab/profile_pics/_healthcheck",
            resource_type: "image",
        })

        return { ok: true }
    } catch (error) {
        if (error?.http_code === 403) {
            return {
                ok: false,
                reason: "restricted_api_key",
                detail:
                    "API key cannot upload. Use Root credentials or enable Upload in Cloudinary Console → API Keys.",
            }
        }
        if (error?.http_code === 401) {
            return {
                ok: false,
                reason: "invalid_credentials",
                detail: "API key or secret does not match this cloud name.",
            }
        }
        return {
            ok: false,
            reason: "unknown",
            detail: error?.message || String(error),
        }
    }
}

export default cloudinary
