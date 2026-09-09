/**
 * Content generation routes
 * Routes for image, video, audio generation using AI providers
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import axios from 'axios';
import logger from '../../utils/logger';
import config from '../../config';

const router = Router();

// Request validation schemas (from Studio's proven patterns)
const GenerateImageSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  size: z.enum(['512x512', '1024x1024', '1024x768']).default('1024x1024'),
  quality: z.enum(['standard', 'high', 'ultra']).default('standard'),
});

const GenerateVideoSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  duration: z.number().int().min(1).max(120).default(10),
  fps: z.number().int().min(1).max(60).default(24),
});

const GenerateAudioSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  voice: z.string().default('neutral'),
  duration: z.number().int().min(1).max(300).default(30),
});

const TextToSpeechSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  voice: z.string().default('neutral'),
  language: z.enum(['fa', 'en']).default('fa'),
});

// Error handling wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * POST /api/v1/generate/image
 * Generate an image from a text prompt
 */
router.post(
  '/image',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate request
    const validation = GenerateImageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: validation.error.errors,
      });
    }

    const { prompt, size, quality } = validation.data;

    // Check if Agnes AI is configured
    if (!config.providers.agnes.enabled || !config.providers.agnes.apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Agnes AI provider is not configured',
      });
    }

    try {
      logger.info(`[Image Generation] Starting - prompt: "${prompt}"`);

      // Call Agnes AI API
      const response = await axios.post(
        `${config.providers.agnes.apiUrl}/images/generations`,
        {
          model: 'agnes-image-2.1-flash',
          prompt,
          size,
          quality,
          n: 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.providers.agnes.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.providers.agnes.timeout,
        },
      );

      const imageUrl = response.data?.data?.[0]?.url;

      if (!imageUrl) {
        logger.warn('[Image Generation] No URL in response');
        return res.status(500).json({
          success: false,
          message: 'No image URL returned from provider',
        });
      }

      logger.info('[Image Generation] Success');
      res.json({
        success: true,
        message: 'Image generated successfully',
        image_url: imageUrl,
      });
    } catch (error: any) {
      logger.error('[Image Generation] Error:', error.message);

      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          message: 'Agnes AI service timeout',
        });
      }

      res.status(500).json({
        success: false,
        message: `Error generating image: ${error.message}`,
      });
    }
  }),
);

/**
 * POST /api/v1/generate/video
 * Generate a video from a text prompt
 */
router.post(
  '/video',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = GenerateVideoSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: validation.error.errors,
      });
    }

    const { prompt, duration, fps } = validation.data;

    if (!config.providers.agnes.enabled || !config.providers.agnes.apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Agnes AI provider is not configured',
      });
    }

    try {
      logger.info(`[Video Generation] Starting - prompt: "${prompt}", duration: ${duration}s`);

      const response = await axios.post(
        `${config.providers.agnes.apiUrl}/videos/generations`,
        {
          model: 'agnes-video-2.0',
          prompt,
          duration,
          fps,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.providers.agnes.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.providers.agnes.timeout,
        },
      );

      const videoUrl = response.data?.data?.url;
      const status = response.data?.data?.status || 'processing';

      if (!videoUrl) {
        logger.warn('[Video Generation] No URL in response');
        return res.status(500).json({
          success: false,
          message: 'No video URL returned from provider',
        });
      }

      logger.info('[Video Generation] Started with status:', status);
      res.status(response.status === 202 ? 202 : 200).json({
        success: true,
        message: 'Video generation started',
        video_url: videoUrl,
        status,
      });
    } catch (error: any) {
      logger.error('[Video Generation] Error:', error.message);

      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          message: 'Agnes AI service timeout',
        });
      }

      res.status(500).json({
        success: false,
        message: `Error generating video: ${error.message}`,
      });
    }
  }),
);

/**
 * POST /api/v1/generate/audio
 * Generate audio from a text prompt
 */
router.post(
  '/audio',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = GenerateAudioSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: validation.error.errors,
      });
    }

    const { prompt, voice, duration } = validation.data;

    if (!config.providers.agnes.enabled || !config.providers.agnes.apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Agnes AI provider is not configured',
      });
    }

    try {
      logger.info(`[Audio Generation] Starting - prompt: "${prompt}"`);

      const response = await axios.post(
        `${config.providers.agnes.apiUrl}/audio/generations`,
        {
          model: 'agnes-audio-2.0',
          prompt,
          voice,
          duration,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.providers.agnes.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.providers.agnes.timeout,
        },
      );

      const audioUrl = response.data?.data?.url;

      if (!audioUrl) {
        logger.warn('[Audio Generation] No URL in response');
        return res.status(500).json({
          success: false,
          message: 'No audio URL returned from provider',
        });
      }

      logger.info('[Audio Generation] Success');
      res.json({
        success: true,
        message: 'Audio generated successfully',
        audio_url: audioUrl,
      });
    } catch (error: any) {
      logger.error('[Audio Generation] Error:', error.message);

      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          message: 'Agnes AI service timeout',
        });
      }

      res.status(500).json({
        success: false,
        message: `Error generating audio: ${error.message}`,
      });
    }
  }),
);

/**
 * POST /api/v1/generate/speech
 * Convert text to speech (Persian/English support)
 */
router.post(
  '/speech',
  asyncHandler(async (req: Request, res: Response) => {
    const validation = TextToSpeechSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: validation.error.errors,
      });
    }

    const { text, voice, language } = validation.data;

    if (!config.providers.agnes.enabled || !config.providers.agnes.apiKey) {
      return res.status(503).json({
        success: false,
        message: 'Agnes AI provider is not configured',
      });
    }

    try {
      logger.info(`[Text-to-Speech] Starting - language: ${language}, voice: ${voice}`);

      const response = await axios.post(
        `${config.providers.agnes.apiUrl}/audio/speech`,
        {
          model: 'agnes-audio-2.0',
          text,
          voice,
          language,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.providers.agnes.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.providers.agnes.timeout,
        },
      );

      const audioUrl = response.data?.data?.url;

      if (!audioUrl) {
        logger.warn('[Text-to-Speech] No URL in response');
        return res.status(500).json({
          success: false,
          message: 'No audio URL returned from provider',
        });
      }

      logger.info('[Text-to-Speech] Success');
      res.json({
        success: true,
        message: 'Speech generated successfully',
        audio_url: audioUrl,
      });
    } catch (error: any) {
      logger.error('[Text-to-Speech] Error:', error.message);

      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          message: 'Agnes AI service timeout',
        });
      }

      res.status(500).json({
        success: false,
        message: `Error converting text to speech: ${error.message}`,
      });
    }
  }),
);

export default router;
