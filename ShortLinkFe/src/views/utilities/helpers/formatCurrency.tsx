export const formatCurrencyWithSymbolAfter = (
    amount: number,
    locale: string = 'en-PH',
    currency: string = 'PHP'
  ): string => {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  
    // Tách ký hiệu tiền tệ và số
    const symbol = formatted.replace(/[0-9.,\s]/g, ''); // Lấy ký hiệu tiền tệ
    const number = formatted.replace(symbol, '').trim(); // Lấy phần số
  
    // Trả về chuỗi với ký hiệu nằm sau
    return `${number} ${symbol}`;
  };
  