/**
 * CSV工具函数
 */

// 清理CSV字段值中的多余空格和引号
function cleanCsvFieldValue(value) {
  if (!value) return '';
  return value.toString().trim().replace(/^["']|["']$/g, '');
}

// 解析可能包含分号分隔符的CSV字段值
function parseCsvValue(value, fieldName = '未知字段', fallback = []) {
  if (!value) return fallback;
  value = cleanCsvFieldValue(value);
  
  try {
    // 如果是JSON数组格式
    if (value.trim().startsWith('[')) {
      return JSON.parse(value);
    }
    
    // 处理半角分号和全角分号分隔的字符串
    return value.split(/[;；]/)
      .map(item => cleanCsvFieldValue(item))
      .filter(item => item.length > 0);
  } catch (e) {
    console.warn(`解析${fieldName}时出错:`, e);
    return fallback;
  }
}

module.exports = {
  cleanCsvFieldValue,
  parseCsvValue
};
