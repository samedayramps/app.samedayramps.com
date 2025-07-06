// Configuration utilities for the admin application
import { dbUtils } from './db';

export interface BusinessConfig {
  pricing: {
    base_monthly: number;
    per_inch_monthly: number;
    base_installation: number;
    per_inch_installation: number;
  };
  business_hours: {
    start: string;
    end: string;
    timezone: string;
  };
  company: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

export interface PricingCalculation {
  monthlyRate: number;
  installationFee: number;
  totalFirstMonth: number;
  estimatedMonthlyTotal: number;
}

export const configUtils = {
  // Get current business configuration
  async getBusinessConfig(): Promise<BusinessConfig> {
    return await dbUtils.getBusinessConfig();
  },

  // Update business configuration
  async updateBusinessConfig(updates: Partial<BusinessConfig>): Promise<void> {
    for (const [key, value] of Object.entries(updates)) {
      await dbUtils.updateSetting(key, value);
    }
  },

  // Calculate pricing based on ramp height
  async calculatePricing(rampHeight: number): Promise<PricingCalculation> {
    const config = await this.getBusinessConfig();
    const pricing = config.pricing;

    const monthlyRate = pricing.base_monthly + (rampHeight * pricing.per_inch_monthly);
    const installationFee = pricing.base_installation + (rampHeight * pricing.per_inch_installation);
    const totalFirstMonth = monthlyRate + installationFee;

    return {
      monthlyRate,
      installationFee,
      totalFirstMonth,
      estimatedMonthlyTotal: monthlyRate,
    };
  },

  // Get business hours in different formats
  async getBusinessHours() {
    const config = await this.getBusinessConfig();
    const hours = config.business_hours;

    return {
      start: hours.start,
      end: hours.end,
      timezone: hours.timezone,
      formatted: `${hours.start} - ${hours.end} ${hours.timezone}`,
    };
  },

  // Check if current time is within business hours
  async isBusinessHours(): Promise<boolean> {
    const config = await this.getBusinessConfig();
    const hours = config.business_hours;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = hours.start.split(':').map(Number);
    const [endHour, endMinute] = hours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  },

  // Get company information
  async getCompanyInfo() {
    const config = await this.getBusinessConfig();
    return config.company;
  },

  // Default settings for new installations
  getDefaultSettings(): Partial<BusinessConfig> {
    return {
      pricing: {
        base_monthly: 125,
        per_inch_monthly: 6,
        base_installation: 75,
        per_inch_installation: 2,
      },
      business_hours: {
        start: '08:00',
        end: '18:00',
        timezone: 'America/Chicago',
      },
      company: {
        name: 'Same Day Ramps',
        phone: '(214) 555-0123',
        email: 'info@samedayramps.com',
        address: 'Dallas-Fort Worth, TX',
      },
    };
  },

  // Initialize default settings in database
  async initializeSettings(): Promise<void> {
    const defaults = this.getDefaultSettings();
    
    for (const [key, value] of Object.entries(defaults)) {
      await dbUtils.updateSetting(key, value);
    }
  },
};

// Environment configuration
export const env = {
  // App configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  
  // Redis
  REDIS_URL: process.env.REDIS_URL,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  
  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Google Services
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
  
  // File Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  
  // Analytics
  VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  VERCEL_SPEED_INSIGHTS_ID: process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID,
  
  // Development
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Computed values
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
}; 