/**
 * Prisma operation wrapper with connection error handling
 * Prevents "kind: Closed" errors from crashing the application
 */

export async function withPrismaErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string = 'Database operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Log the error with context
    console.error(`${operationName} failed:`, error.message);
    
    // Check for connection errors
    const isConnectionError = 
      error.message?.includes('kind: Closed') ||
      error.message?.includes('connection') ||
      error.message?.includes('Connection') ||
      error.code === 'P1001' ||
      error.code === 'P1002' ||
      error.code === 'P1008' ||
      error.code === 'P1017';
    
    if (isConnectionError) {
      console.error('💥 Database connection lost. Error will be handled by middleware.');
      // Create a more user-friendly error
      const connectionError: any = new Error('Database connection unavailable');
      connectionError.name = 'PrismaClientInitializationError';
      connectionError.originalError = error;
      throw connectionError;
    }
    
    // Re-throw other errors for normal handling
    throw error;
  }
}
