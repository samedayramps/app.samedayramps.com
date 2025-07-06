import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Database utility functions
export const dbUtils = {
  // Get application settings
  async getSettings() {
    const settings = await db.settings.findMany();
    return settings.reduce((acc: Record<string, unknown>, setting: { key: string; value: unknown }) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, unknown>);
  },

  // Update a setting
  async updateSetting(key: string, value: Prisma.InputJsonValue) {
    return await db.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },

  // Get or create business configuration
  async getBusinessConfig() {
    const config = await this.getSettings();
    
    // Default business configuration
    const defaults = {
      pricing: {
        base_monthly: parseFloat(process.env.DEFAULT_PRICING_BASE_MONTHLY || '125'),
        per_inch_monthly: parseFloat(process.env.DEFAULT_PRICING_PER_INCH_MONTHLY || '6'),
        base_installation: parseFloat(process.env.DEFAULT_PRICING_BASE_INSTALLATION || '75'),
        per_inch_installation: parseFloat(process.env.DEFAULT_PRICING_PER_INCH_INSTALLATION || '2'),
      },
      business_hours: {
        start: process.env.DEFAULT_BUSINESS_HOURS_START || '08:00',
        end: process.env.DEFAULT_BUSINESS_HOURS_END || '18:00',
        timezone: process.env.DEFAULT_TIMEZONE || 'America/Chicago',
      },
      company: {
        name: 'Same Day Ramps',
        phone: '(214) 555-0123',
        email: 'info@samedayramps.com',
        address: 'Dallas-Fort Worth, TX',
      },
    };

    // Merge with database settings
    return {
      ...defaults,
      ...config,
    };
  },

  // Create audit event
  async createEvent(
    entityType: string,
    entityId: string,
    eventType: string,
    eventData: Prisma.InputJsonValue,
    userId?: string,
    ipAddress?: string
  ) {
    return await db.event.create({
      data: {
        entityType,
        entityId,
        eventType,
        eventData,
        userId,
        ipAddress,
      },
    });
  },

  // Health check
  async healthCheck() {
    try {
      await db.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        timestamp: new Date(), 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
}; 