/**
 * 通用工具函数模块
 * 
 * 此模块包含网站生成过程中通用的工具函数，供所有生成脚本使用。
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// 缓存
const templateCache = {};
const contentCache = {};

// 将常用的 fs 函数转换为 Promise 版本
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);
const statAsync = util.promisify(fs.stat);

/**
 * 读取模板文件并缓存
 * @param {string} templatePath 模板文件路径
 * @returns {Promise<string>} 模板内容
 */
async function getTemplate(templatePath) {
    if (templateCache[templatePath]) {
        return templateCache[templatePath];
    }
    
    try {
        const template = await readFileAsync(templatePath, 'utf8');
        templateCache[templatePath] = template;
        return template;
    } catch (error) {
        logError(`无法读取模板: ${templatePath}`, error);
        throw error;
    }
}

/**
 * 同步版本读取模板文件并缓存
 * @param {string} templatePath 模板文件路径
 * @returns {string} 模板内容
 */
function getTemplateSync(templatePath) {
    if (templateCache[templatePath]) {
        return templateCache[templatePath];
    }
    
    try {
        const template = fs.readFileSync(templatePath, 'utf8');
        templateCache[templatePath] = template;
        return template;
    } catch (error) {
        logError(`无法读取模板: ${templatePath}`, error);
        throw error;
    }
}

/**
 * 计算相对路径
 * @param {number} fromDepth 源页面的目录深度
 * @param {number} toDepth 目标页面的目录深度
 * @param {string} basePath 基础路径（可选）
 * @returns {string} 相对路径
 */
function getRelativePath(fromDepth, toDepth, basePath = '') {
    if (fromDepth === toDepth) {
        return basePath;
    }
    
    if (fromDepth < toDepth) {
        return '../'.repeat(toDepth - fromDepth) + basePath;
    }
    
    return basePath;
}

/**
 * 检查是否需要重建文件
 * @param {string} sourcePath 源文件路径
 * @param {string} targetPath 目标文件路径
 * @returns {Promise<boolean>} 是否需要重建
 */
async function shouldRebuild(sourcePath, targetPath) {
    try {
        const targetStat = await statAsync(targetPath);
        const sourceStat = await statAsync(sourcePath);
        
        return sourceStat.mtime > targetStat.mtime;
    } catch (error) {
        // 如果目标文件不存在，则需要构建
        return true;
    }
}

/**
 * 同步版本检查是否需要重建文件
 * @param {string} sourcePath 源文件路径
 * @param {string} targetPath 目标文件路径
 * @returns {boolean} 是否需要重建
 */
function shouldRebuildSync(sourcePath, targetPath) {
    try {
        const targetStat = fs.statSync(targetPath);
        const sourceStat = fs.statSync(sourcePath);
        
        return sourceStat.mtime > targetStat.mtime;
    } catch (error) {
        // 如果目标文件不存在，则需要构建
        return true;
    }
}

/**
 * 确保目录存在，如不存在则创建
 * @param {string} dirPath 目录路径
 */
async function ensureDirectoryExists(dirPath) {
    try {
        await mkdirAsync(dirPath, { recursive: true });
    } catch (error) {
        // 如果目录已存在，忽略错误
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * 同步版本确保目录存在，如不存在则创建
 * @param {string} dirPath 目录路径
 */
function ensureDirectoryExistsSync(dirPath) {
    try {
        fs.mkdirSync(dirPath, { recursive: true });
    } catch (error) {
        // 如果目录已存在，忽略错误
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * 记录错误信息
 * @param {string} message 错误消息
 * @param {Error} error 错误对象
 * @param {string} severity 严重性级别
 */
function logError(message, error, severity = 'error') {
    const timestamp = new Date().toISOString();
    
    console[severity](`[${timestamp}] ${message}`);
    
    if (error && error.stack) {
        console[severity](error.stack);
    } else if (error) {
        console[severity](error);
    }
}

module.exports = {
    getTemplate,
    getTemplateSync,
    getRelativePath,
    shouldRebuild,
    shouldRebuildSync,
    ensureDirectoryExists,
    ensureDirectoryExistsSync,
    logError,
    readFileAsync,
    writeFileAsync,
    mkdirAsync,
    statAsync
};
