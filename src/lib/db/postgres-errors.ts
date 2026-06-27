type PostgresErrorLike = {
  code?: string;
  constraint?: string;
  cause?: unknown;
};

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

function getPostgresError(error: unknown): PostgresErrorLike | null {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const pgError = error as PostgresErrorLike;
  if (pgError.code === POSTGRES_UNIQUE_VIOLATION_CODE) {
    return pgError;
  }

  if (pgError.cause) {
    return getPostgresError(pgError.cause);
  }

  return null;
}

export function isUniqueConstraintViolation(
  error: unknown,
  constraint?: string,
): boolean {
  const pgError = getPostgresError(error);
  if (!pgError) {
    return false;
  }

  if (constraint && pgError.constraint !== constraint) {
    return false;
  }

  return true;
}
