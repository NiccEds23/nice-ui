/**
 * Number and Currency Formatting Utility
 */

/**
 * Interface for formatting options
 */
interface FormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const DEFAULT_LOCALE = 'id-ID';
const DEFAULT_CURRENCY = 'IDR';

/**
 * Format a number to a currency string
 * @param value - The number to format
 * @param options - Formatting options (currency, locale, digits)
 * @returns Formatted currency string (e.g., "Rp 10.000,00")
 */
export const formatCurrency = (
    value: number | string | null | undefined,
    options: FormatOptions = {}
): string => {
    if (value === null || value === undefined || value === '') return '';

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '';

    const {
        locale = DEFAULT_LOCALE,
        currency = DEFAULT_CURRENCY,
        minimumFractionDigits = 0,
        maximumFractionDigits = 0, // Default to 0 for IDR usually, user can override
    } = options;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(numberValue);
};

/**
 * Format a number with standard decimal delimiters
 * @param value - The number to format
 * @param options - Formatting options (locale, digits)
 * @returns Formatted decimal string (e.g., "10.000,50")
 */
export const formatDecimal = (
    value: number | string | null | undefined,
    options: FormatOptions = {}
): string => {
    if (value === null || value === undefined || value === '') return '';

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return '';

    const {
        locale = DEFAULT_LOCALE,
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
    } = options;

    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(numberValue);
};

/**
 * Parse a formatted string back to a number
 * Useful for processing raw inputs if needed, though Maska usually handles the raw value.
 * @param value - The formatted string (e.g., "10.000,00")
 * @returns The numeric value (e.g., 10000)
 */
export const parseNumber = (value: string): number => {
    if (!value) return 0;
    // Remove thousand separators ( dots in ID, commas in EN)
    // This is a naive implementation assuming ID/EU format (dot as thousand, comma as decimal)
    // For robustness with multiple locales, this needs to be smarter.
    // Assuming 'id-ID' standard:
    const cleanStr = value.replace(/\./g, '').replace(/,/g, '.');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
};

/**
 * Common Maska Options tokens
 */
export const MASKA_TOKENS = {
    // Custom tokens if needed
};
