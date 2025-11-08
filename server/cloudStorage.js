import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

/**
 * Upload file to Drime Cloud Storage
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} - Upload result with cloud URL
 */
export async function uploadToCloudStorage(file) {
  try {
    console.log('📤 Uploading to Drime Cloud:', file.originalname);

    const baseUrl = process.env.DRIME_CLOUD_BASE_URL || 'https://app.drime.cloud/api/v1/uploads';
    const accessToken = process.env.DRIME_CLOUD_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('DRIME_CLOUD_ACCESS_TOKEN not configured');
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      throw new Error('File not found on disk');
    }

    // Create form data
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.path);
    formData.append('file', fileStream, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    // Upload to Drime Cloud
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} - ${responseText}`);
    }

    console.log('✅ Successfully uploaded to Drime Cloud');
    console.log('Response:', responseData);

    return {
      success: true,
      status: response.status,
      data: responseData,
      filename: file.originalname,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Drime Cloud upload error:', error);
    throw error;
  }
}

/**
 * Delete local file after delay
 * @param {string} filePath - Local file path
 * @param {number} delayMinutes - Delay in minutes before deletion
 */
export function scheduleFileDelete(filePath, delayMinutes = 5) {
  const delayMs = delayMinutes * 60 * 1000;
  
  console.log(`⏰ Scheduled deletion of ${filePath} in ${delayMinutes} minutes`);
  
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) {
        const fileName = filePath.split('/').pop();
        fs.unlinkSync(filePath);
        console.log(`✅ [DELETED] File removed from local storage: ${fileName}`);
      } else {
        console.log(`⚠️  [WARNING] File already deleted: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ [ERROR] Failed to delete file ${filePath}:`, error);
    }
  }, delayMs);
}
