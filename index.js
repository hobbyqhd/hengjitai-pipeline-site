// 静态网站服务入口文件
export default {
  async fetch(request, env) {
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      // 如果资源未找到，返回404页面或重定向到首页
      return new Response("Not Found", { status: 404 });
    }
  }
}
