from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
import hashlib
import uuid
import xml.etree.ElementTree as ET

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 生成短哈希ID的函数
def generate_short_id(title: str) -> str:
    # 结合标题和当前时间生成唯一字符串
    unique_str = f"{title}{datetime.now().isoformat()}{uuid.uuid4()}"
    # 使用SHA-256生成哈希
    hash_obj = hashlib.sha256(unique_str.encode())
    # 取前8个字符作为短ID
    return hash_obj.hexdigest()[:8]

# 模拟数据库 - 在实际项目中应替换为真实数据库
posts = [
    {
        "id": generate_short_id("欢迎来到我的博客"),
        "title": "欢迎来到我的博客",
        "content": "这是我的第一篇博客文章，使用Next.js和Flask构建。\n\n我将在这个博客中分享我的学习心得、技术笔记和生活感悟。希望能对大家有所帮助。",
        "tags": ["技术", "博客"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Next.js 16 新特性介绍"),
        "title": "Next.js 16 新特性介绍",
        "content": "Next.js 16 带来了许多令人兴奋的新特性，包括：\n\n- Turbopack 构建速度提升\n- React 19 支持\n- 更好的服务器组件支持\n- 改进的开发体验\n\n这些新特性让Next.js在构建现代Web应用时更加高效和便捷。",
        "tags": ["Next.js", "React", "前端"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Flask API 最佳实践"),
        "title": "Flask API 最佳实践",
        "content": "在构建Flask API时，有一些最佳实践可以遵循：\n\n1. 使用蓝图组织路由\n2. 实现适当的错误处理\n3. 添加请求验证\n4. 使用环境变量管理配置\n5. 实现适当的日志记录\n6. 添加API文档\n\n遵循这些最佳实践可以让你的API更加健壮、可维护和安全。",
        "tags": ["Flask", "Python", "后端"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("TypeScript 入门指南"),
        "title": "TypeScript 入门指南",
        "content": "TypeScript 是 JavaScript 的超集，它添加了静态类型检查。\n\n主要特点：\n- 静态类型检查\n- 更好的IDE支持\n- 代码可维护性提升\n- 更好的团队协作\n\n学习TypeScript可以帮助你编写更可靠、更易于维护的代码。",
        "tags": ["TypeScript", "JavaScript", "前端"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Tailwind CSS 实用技巧"),
        "title": "Tailwind CSS 实用技巧",
        "content": "Tailwind CSS 是一个实用优先的CSS框架，它提供了大量的预定义类，可以快速构建现代化的UI。\n\n一些实用技巧：\n- 使用自定义颜色主题\n- 利用Tailwind的响应式设计\n- 合理组织CSS类\n- 使用@apply指令提取重复样式\n\n掌握这些技巧可以让你更加高效地使用Tailwind CSS。",
        "tags": ["Tailwind CSS", "CSS", "前端"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Python 3.12 新特性详解"),
        "title": "Python 3.12 新特性详解",
        "content": "Python 3.12 带来了许多激动人心的新特性：\n\n## 1. 增强的类型注解\n\nPython 3.12 引入了更灵活的类型注解语法，包括：\n- 泛型类型别名\n- 类型标注的PEP 695实现\n- 更简单的泛型类语法\n\n## 2. 性能提升\n\n- 更快的函数调用\n- 改进的循环性能\n- 优化的内存使用\n\n## 3. 语法改进\n\n- `async`/`await` 语法简化\n- 多行 f-strings 增强\n\n这些新特性让Python 3.12在开发体验和性能方面都有了显著提升。",
        "tags": ["Python", "后端", "编程"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("React 19 新特性前瞻"),
        "title": "React 19 新特性前瞻",
        "content": "React 19 预计将带来以下重要特性：\n\n## 1. Server Components 稳定版\n\nReact Server Components 将从实验阶段进入稳定版，允许开发者在服务器端渲染组件，减少客户端JavaScript体积。\n\n## 2. Actions API\n\n新的Actions API将简化表单处理和数据提交，提供更直观的方式来处理用户交互。\n\n## 3. React Compiler\n\nReact Compiler将自动优化组件渲染，减少不必要的重渲染，提升应用性能。\n\n## 4. 改进的并发特性\n\n进一步增强并发渲染能力，提供更好的用户体验。\n\nReact 19 将继续推动前端开发的边界，为开发者提供更强大的工具和更好的开发体验。",
        "tags": ["React", "前端", "JavaScript"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Git 高级技巧分享"),
        "title": "Git 高级技巧分享",
        "content": "Git 是现代开发中不可或缺的版本控制工具。以下是一些高级技巧：\n\n## 1. 交互式rebase\n\n使用 `git rebase -i` 可以交互式地修改提交历史，包括合并、编辑和删除提交。\n\n## 2. 重置和恢复\n\n- `git reset`: 重置分支指向和工作目录\n- `git checkout --`: 恢复工作目录文件\n- `git revert`: 创建新提交来撤销之前的提交\n\n## 3. 子模块和子树\n\n- `git submodule`: 管理外部依赖\n- `git subtree`: 将外部仓库作为子目录引入\n\n## 4. 钩子脚本\n\n使用Git钩子可以自动化开发流程，如提交前的代码检查、自动部署等。\n\n掌握这些高级技巧可以让你更加高效地使用Git，提高开发效率。",
        "tags": ["Git", "开发工具", "版本控制"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("Docker 容器化最佳实践"),
        "title": "Docker 容器化最佳实践",
        "content": "Docker 容器化已经成为现代应用部署的标准方式。以下是一些最佳实践：\n\n## 1. 镜像优化\n\n- 使用多阶段构建减少镜像大小\n- 选择合适的基础镜像（如Alpine）\n- 最小化镜像层数\n\n## 2. 容器安全\n\n- 使用非root用户运行容器\n- 定期更新基础镜像和依赖\n- 扫描镜像漏洞\n\n## 3. 编排和管理\n\n- 使用Docker Compose管理多容器应用\n- 考虑使用Kubernetes进行大规模部署\n\n## 4. 日志和监控\n\n- 配置适当的日志记录\n- 使用监控工具（如Prometheus、Grafana）监控容器性能\n\n遵循这些最佳实践可以确保你的容器化应用安全、高效地运行。",
        "tags": ["Docker", "容器化", "DevOps"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("数据结构与算法学习心得"),
        "title": "数据结构与算法学习心得",
        "content": "数据结构与算法是程序员的基本功。以下是我的学习心得：\n\n## 1. 学习方法\n\n- 理解基本概念和原理\n- 动手实现常见数据结构和算法\n- 刷LeetCode等平台的题目\n- 学习算法复杂度分析\n\n## 2. 重点数据结构\n\n- 数组、链表、栈、队列\n- 树、图\n- 哈希表、集合\n- 堆、优先队列\n\n## 3. 重点算法\n\n- 排序算法\n- 搜索算法\n- 动态规划\n- 贪心算法\n- 回溯算法\n\n## 4. 实践应用\n\n将所学的算法应用到实际项目中，解决实际问题，加深理解。\n\n持续学习和实践是掌握数据结构与算法的关键。",
        "tags": ["数据结构", "算法", "编程基础"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": generate_short_id("前端性能优化指南"),
        "title": "前端性能优化指南",
        "content": "前端性能优化是提升用户体验的重要手段。以下是一些优化策略：\n\n## 1. 资源加载优化\n\n- 压缩CSS和JavaScript\n- 图片优化（压缩、懒加载、WebP格式）\n- 使用CDN加速资源加载\n\n## 2. 渲染优化\n\n- 减少DOM操作\n- 使用虚拟DOM\n- 优化CSS选择器\n- 使用requestAnimationFrame\n\n## 3. 代码优化\n\n- 减少JavaScript执行时间\n- 避免不必要的重渲染\n- 使用Web Workers处理耗时任务\n\n## 4. 缓存策略\n\n- 利用浏览器缓存\n- 使用Service Worker实现离线缓存\n\n## 5. 监控和分析\n\n- 使用Lighthouse等工具分析性能\n- 监控真实用户体验（RUM）\n\n通过持续优化，可以显著提升前端应用的性能和用户体验。",
        "tags": ["前端", "性能优化", "用户体验"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

# 获取所有文章，支持分页、标签筛选和关键词搜索
@app.route('/api/posts', methods=['GET'])
def get_posts():
    # 获取查询参数
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    tag = request.args.get('tag', None)
    search = request.args.get('search', None)
    
    # 筛选文章
    filtered_posts = posts
    
    # 标签筛选
    if tag:
        filtered_posts = [p for p in filtered_posts if tag in p.get('tags', [])]
    
    # 关键词搜索
    if search:
        search_lower = search.lower()
        filtered_posts = [p for p in filtered_posts 
                          if search_lower in p.get('title', '').lower() 
                          or search_lower in p.get('content', '').lower()]
    
    # 按更新时间降序排序
    filtered_posts.sort(key=lambda p: p.get('updated_at', ''), reverse=True)
    
    # 分页
    start = (page - 1) * per_page
    end = start + per_page
    paginated_posts = filtered_posts[start:end]
    
    # 计算总数和页数
    total = len(filtered_posts)
    total_pages = (total + per_page - 1) // per_page
    
    # 返回结果
    return jsonify({
        "posts": paginated_posts,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages
        }
    })

# 获取单篇文章
@app.route('/api/posts/<string:post_id>', methods=['GET'])
def get_post(post_id):
    # 支持同时处理整数ID和字符串ID
    try:
        # 尝试将post_id转换为整数，以兼容旧的整数ID
        int_post_id = int(post_id)
        post = next((p for p in posts if p['id'] == int_post_id or p['id'] == post_id), None)
    except ValueError:
        # 如果转换失败，只搜索字符串ID
        post = next((p for p in posts if p['id'] == post_id), None)
    
    if post:
        return jsonify(post)
    return jsonify({"error": "Post not found"}), 404

# 创建新文章（需要管理员权限）
@app.route('/api/posts', methods=['POST'])
def create_post():
    # 简单的权限控制 - 实际项目中应使用更安全的认证方式
    # 这里假设只有提供了secret参数才有权限创建文章
    data = request.get_json()
    
    # 简单的权限验证（实际项目中应使用更安全的方式）
    if data.get('secret') != 'admin-secret':
        return jsonify({"error": "Unauthorized"}), 401
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({"error": "Title and content are required"}), 400
    
    # 使用短哈希ID
    new_post = {
        "id": generate_short_id(data['title']),
        "title": data['title'],
        "content": data['content'],
        "tags": data.get('tags', []),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    posts.append(new_post)
    return jsonify(new_post), 201

# 更新文章
@app.route('/api/posts/<string:post_id>', methods=['PUT'])
def update_post(post_id):
    # 简单的权限验证（实际项目中应使用更安全的方式）
    data = request.get_json()
    if data.get('secret') != 'admin-secret':
        return jsonify({"error": "Unauthorized"}), 401
    
    # 支持同时处理整数ID和字符串ID
    try:
        int_post_id = int(post_id)
        post = next((p for p in posts if p['id'] == int_post_id or p['id'] == post_id), None)
    except ValueError:
        post = next((p for p in posts if p['id'] == post_id), None)
    
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    if 'title' in data:
        post['title'] = data['title']
    if 'content' in data:
        post['content'] = data['content']
    if 'tags' in data:
        post['tags'] = data['tags']
    post['updated_at'] = datetime.now().isoformat()
    
    return jsonify(post)

# 删除文章
@app.route('/api/posts/<string:post_id>', methods=['DELETE'])
def delete_post(post_id):
    # 简单的权限验证（实际项目中应使用更安全的方式）
    # 从请求头获取secret参数，因为DELETE请求通常没有body
    secret = request.args.get('secret') or request.headers.get('X-Secret')
    if secret != 'admin-secret':
        return jsonify({"error": "Unauthorized"}), 401
    
    # 支持同时处理整数ID和字符串ID
    global posts
    try:
        int_post_id = int(post_id)
        posts = [p for p in posts if p['id'] != int_post_id and p['id'] != post_id]
    except ValueError:
        posts = [p for p in posts if p['id'] != post_id]
    
    return jsonify({"message": "Post deleted"})

# 获取所有标签
@app.route('/api/tags', methods=['GET'])
def get_tags():
    # 收集所有标签
    all_tags = set()
    for post in posts:
        for tag in post.get('tags', []):
            all_tags.add(tag)
    
    # 返回标签列表
    return jsonify(list(all_tags))

# RSS订阅功能
@app.route('/rss', methods=['GET'])
def get_rss():
    # 创建RSS根元素
    rss = ET.Element('rss', version='2.0')
    channel = ET.SubElement(rss, 'channel')
    
    # 频道信息
    title = ET.SubElement(channel, 'title')
    title.text = '我的博客'
    
    link = ET.SubElement(channel, 'link')
    link.text = 'http://localhost:3000'
    
    description = ET.SubElement(channel, 'description')
    description.text = '使用Next.js和Flask构建的个人博客'
    
    # 按更新时间降序排序文章
    sorted_posts = sorted(posts, key=lambda p: p.get('updated_at', ''), reverse=True)
    
    # 添加文章项
    for post in sorted_posts[:10]:  # 只显示最新的10篇文章
        item = ET.SubElement(channel, 'item')
        
        # 文章标题
        item_title = ET.SubElement(item, 'title')
        item_title.text = post['title']
        
        # 文章链接
        item_link = ET.SubElement(item, 'link')
        item_link.text = f'http://localhost:3000/posts/{post["id"]}'
        
        # 文章描述（截取前200个字符）
        item_desc = ET.SubElement(item, 'description')
        # 简单的HTML转义
        content = post['content'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        item_desc.text = f'<![CDATA[{content[:200]}...]]>'
        
        # 文章发布时间
        item_pub_date = ET.SubElement(item, 'pubDate')
        # 转换为RSS标准格式（RFC 822）
        pub_date = datetime.fromisoformat(post['created_at'])
        item_pub_date.text = pub_date.strftime('%a, %d %b %Y %H:%M:%S GMT')
        
        # 文章唯一标识
        item_guid = ET.SubElement(item, 'guid', isPermaLink='false')
        item_guid.text = post['id']
    
    # 生成XML字符串
    xml_string = ET.tostring(rss, encoding='utf-8', xml_declaration=True)
    
    # 创建响应
    response = make_response(xml_string)
    response.headers['Content-Type'] = 'application/rss+xml; charset=utf-8'
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5001)