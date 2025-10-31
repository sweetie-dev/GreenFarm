import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Gera o hash de uma senha usando bcrypt
 * @param password - Senha em texto plano
 * @returns Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erro ao gerar hash da senha');
  }
}

/**
 * Compara uma senha em texto plano com um hash
 * @param password - Senha em texto plano
 * @param hashedPassword - Hash da senha armazenado
 * @returns true se a senha corresponde ao hash, false caso contrário
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Erro ao comparar senha');
  }
}

/**
 * Valida se uma senha atende aos requisitos mínimos de segurança
 * @param password - Senha a ser validada
 * @returns true se a senha é válida, false caso contrário
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

