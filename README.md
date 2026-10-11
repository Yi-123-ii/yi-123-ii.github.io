# Academic Personal Homepage

一个适合长期维护的学术个人主页。使用 HTML5、CSS3、原生 JavaScript 和 JSON，没有框架、数据库、字体 CDN 或网站构建依赖。当前 `data/profile.json` 已填入唐梓怡 / Ziyi Tang 提供的资料和三项获奖；Publications 保留导航并显示暂无信息提示，Awards 展示真实奖项，其他尚未提供的栏目自动隐藏。通用示例保存在 `data/profile.example.json`，其中的经历不代表任何真实人物。

## 目录

```text
presonal page/                    # 当前项目目录就是仓库根目录
├── index.html                   # 页面骨架，无个人资料
├── css/style.css                # 样式与响应式布局
├── js/main.js                   # 读取配置、安全渲染、栏目切换
├── data/profile.json            # 日常维护只需修改这个文件
├── data/profile.example.json    # 完整示例，用于参考字段和添加条目
├── assets/
│   ├── avatar.png               # 当前使用的个人头像
│   ├── avatar-placeholder.svg   # 头像占位图
│   ├── project-search.svg       # 示例项目示意图
│   ├── favicon.svg              # 网站图标
│   ├── cv-example.html          # 可用的 CV 占位页
│   └── publication-example.pdf  # 仅演示 PDF 链接的占位文件
├── .github/workflows/deploy.yml # GitHub Pages 自动部署
├── .gitignore
├── .nojekyll
└── README.md
```

## 1. 本地运行

不能直接双击 `index.html`：浏览器通常不允许 `file://` 页面读取 JSON，需要本地 HTTP 服务器。

### 方法 A：Python

在当前项目文件夹打开终端，运行：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

如果 Windows 的 Python 命令是 `py`，使用 `py -m http.server 8000 --bind 127.0.0.1`。

浏览器打开 **http://127.0.0.1:8000/**。停止服务器按 `Ctrl+C`。端口被占用时改成 `8001`，访问地址也相应修改。

### 方法 B：VS Code

安装 Live Server 扩展，打开本项目，右键 `index.html` → **Open with Live Server**。扩展仅用于本地预览，不是网站依赖。

改完 JSON 或 CSS 后保存文件，再刷新浏览器即可。部署到 GitHub Pages 后不需要运行 Python，它只用于本地预览。

## 2. 修改自己的资料

打开 **`data/profile.json`**。可以把 JSON 理解为存放资料的结构体：`{}` 是对象，`[]` 是列表，每个字段都有一个明确的名称。

| 字段 | 内容 |
| --- | --- |
| `site.title` | 浏览器标题 |
| `site.description` | 网页描述 |
| `site.language` | 内容语言，例如 `en`；当前网页界面、提示和个人资料统一使用英文 |
| `site.updatedAt` | 手动维护的更新日期文本 |
| `site.demo` | 示例提示；替换完资料后改成 `false` |
| `site.emptySectionMessages` | 可选的空栏目提示；支持 `publications` 和 `awards`，有非空文字时保留对应空栏目 |
| `person.name` | 姓名，唯一必填的资料字段 |
| `person.nameLocal` | 中文姓名或第二种语言的姓名，可留空 |
| `person.role` / `affiliation` | 身份 / 学校或单位 |
| `person.department` / `location` | 院系 / 地点 |
| `person.email` | 纯邮箱地址，不加 `mailto:` |
| `person.photo` / `photoAlt` | 头像路径 / 图片替代文本 |
| `social.github` / `googleScholar` / `cv` | GitHub、Google Scholar、简历链接 |
| `social.emailMode` | `gmail` 在浏览器打开 Gmail 写信页；`mailto`（默认）调用访问者的邮件应用 |
| `social.additionalLinks` | 额外链接列表，每项包含 `label`、`url`，可选 `icon` |
| `about.paragraphs` | 简介段落；支持普通字符串，或包含 `parts` 的对象来添加文字链接 |
| `about.researchInterests` | 研究方向字符串列表 |
| `education` | 教育经历列表 |
| `researchExperience` | 研究经历列表 |
| `publications` | 论文列表，按年份自动倒序排列 |
| `projects` | 项目列表，按配置顺序显示 |
| `awards` | 获奖列表，按年份自动倒序排列 |
| `service` | 学术服务、社区活动等列表，按配置顺序显示 |

当前资料在 `data/profile.json`，完整示例在 `data/profile.example.json`。新增条目时可以参考示例字段，只修改当前资料文件。各列表的字段如下：

| 列表 | 字段 |
| --- | --- |
| `education` | `institution`、`degree`、`period`、`description`、`url` |
| `researchExperience` | `organization`、`role`、`period`、`description`、`url` |
| `publications` | `title`、`authors`（字符串列表）、`venue`、`year`、`links`（包含 `pdf`、`code`、`project`） |
| `projects` | `name`、`description`、`technologies`（字符串列表）、`year`、`github`、`url`、`image`、`imageAlt` |
| `awards` | 依次展示 `name`、`organization`、`date`（例如 `Jun. 2026`）；`date` 为空时展示 `year`，仍按 `year` 倒序；可选 `url`。`description` 可保留作资料记录，不展示在正文中 |
| `service` | `title`、`organization`、`period`、`description`、`url` |

Awards 当前依次展示奖项名称、颁奖单位、证书日期，日期单独一行，替代原来的学年度或获奖说明。只知道年份时填写 `year` 即可；知道月份时还可填写 `date`。例如：`{"name": "Example Award", "organization": "Example University", "year": 2026, "date": "Jun. 2026"}`。网页内容使用英文；本 README 的中文说明用于日常维护。

CSS 或 JavaScript 更新时可以修改 `index.html` 中资源路径的 `v` 参数，让浏览器读取新文件；它不会影响只修改 JSON 的日常更新。遇到旧页面时可以使用 `Ctrl+F5` 强制刷新。

当前侧栏 Email 链接采用 Gmail 网页写信模式，收件人由 `person.email` 自动填写，访问者可能需要先登录自己的 Google 账号。点击后不会自动发送邮件，也不会打开收件人的邮箱账户。侧栏同时显示完整邮箱地址，访问者也可复制到其他邮箱服务中写信。

不需要 Gmail 模式时，将 `social.emailMode` 改为 `mailto`，即可调用访问者设备设置的邮件应用；未设置邮件应用时可能无法打开。收件地址的服务类型（Gmail、QQ 等）不会决定访问者用哪个应用发送邮件。

### 在简介中添加超链接

普通段落继续使用字符串；需要链接的段落可以使用以下格式，与普通段落一起放在 `about.paragraphs` 数组中：

```json
{
  "parts": [
    "I work with ",
    { "text": "Example Laboratory", "url": "https://example.com/" },
    "."
  ]
}
```

每个字符串片段会保留空格；链接用 `text` 和 `url` 表示。文字仍按纯文本安全渲染，不支持 HTML。无效链接会退回普通文字，空段落会被忽略。个人经历应填写自己的真实信息。

### 添加一篇论文

在 `publications` 数组中复制一项并修改，比如：

```json
{
  "title": "Your Paper Title",
  "authors": ["Your Name", "Coauthor Name"],
  "venue": "Conference or Journal Name",
  "year": 2026,
  "links": {
    "pdf": "./assets/papers/your-paper.pdf",
    "code": "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
    "project": "https://example.com/your-project/"
  }
}
```

把对应 PDF 放入 `assets/papers/your-paper.pdf`。`year` 推荐写成四位整数，不需要自己排序。缺少有效年份的论文会放在最后的 “Other publications” 分组。作者姓名与 `person.name` 完全相同时，会自动加粗。

### 更换头像、项目图片和 CV

1. 将图片放入 `assets/`，例如 `assets/photo.jpg`。
2. 将 `person.photo` 改为 `./assets/photo.jpg`。照片用接近正方形或竖向构图更合适。
3. 将自己的简历放入 `assets/cv.pdf`，将 `social.cv` 改为 `./assets/cv.pdf`。
4. 项目图片使用 `projects` 中的 `image` 字段；不需要图片时设为 `""`。

静态文件本身需要上传或替换，但网页不需要修改 HTML / JavaScript。图片失败时显示占位效果。示例 CV 链接指向说明页；它不是你的真实简历。第一篇示例论文的 PDF 指向明确标注的占位文件，不是真实论文。示例 GitHub、Google Scholar 链接指向服务首页，请换成自己的个人链接。

### 隐藏暂时没有内容的栏目

将对应列表设为空数组，例如：

```json
"publications": [],
"projects": [],
"awards": [],
"service": []
```

以上是对象内部的字段片段，不是独立 JSON 文件；最后一个字段后不能留逗号。

- 默认情况下，空列表会同时隐藏导航项和正文栏目。
- 当前主页特意保留 Publications 和 Awards。在 `site.emptySectionMessages` 中配置对应提示文字即可显示空栏目；删除对应字段或将提示改为 `""`，空栏目就会隐藏。例如 `"emptySectionMessages": {"publications": "No publications listed yet.", "awards": "No awards listed yet."}`。
- 填入有效论文或获奖条目后，页面自动显示条目，暂无信息提示会消失；不用修改 HTML 或 JavaScript。
- 简介、研究方向、教育、研究经历分别为空时，只隐藏对应的小分区；它们全部为空时隐藏 About。
- 所有内容都为空、也没有配置空栏目提示时，显示简洁的 “Profile coming soon”，保留有效的侧栏资料。
- 可选文字或链接用 `""`；空链接不会产生按钮。
- 教育项必须有 `institution`；研究经历项必须有 `organization`；论文和服务项必须有 `title`；项目和获奖项必须有 `name`。只有空对象、空格或没有这些主字段的条目会被忽略。
- 手机、平板、桌面使用同一个配置。导航支持直接访问 `#publications` 等链接，也支持浏览器前进、后退。

### JSON 的基本规则

- 字段名和字符串都使用英文双引号 `"`，不能用单引号或中文引号。
- 相邻字段、列表项目之间使用逗号，最后一项后不能有逗号。
- 不能写 `//` 或 `/* */` 注释。
- 段落里需要双引号时写成 `\"`；反斜杠写成 `\\`。
- 文字作为纯文本显示，不能在简介中写 HTML 标签实现排版。
- 文件保存为 UTF-8。网页支持中文，不需要把中文转换成编码。
- 相对路径使用 `/`，建议小写文件名，避免空格。路径区分大小写，Windows 本地能打开不代表 GitHub 上一定能打开。
- 本地图片、PDF、JSON 等路径使用 `./assets/...`，不要写 `C:\...` 或 `/assets/...`。这样也能兼容仓库子路径。

可选检查命令：

```powershell
python -m json.tool data/profile.json
```

没有报错表示 JSON 语法正确。JSON 文件不存在、格式错误或网络超时时，网页会显示友好提示和重试按钮。

## 3. 部署到 GitHub Pages

目标地址为 **`https://USERNAME.github.io`**，其中 `USERNAME` 换成你自己的 GitHub 用户名。

### 第一次部署

1. 登录 GitHub，创建一个 **Public** 仓库，仓库名必须是 **`username.github.io`**（用户名转为小写）。例如用户名为 `alice`，仓库名就为 `alice.github.io`。
2. 将本项目的内容放在仓库根目录：根目录应直接看到 `index.html`，不能再套一层 `academic-homepage/`。
3. 确保 `.github/workflows/deploy.yml` 也上传。网页上传或文件选择器可能不显示点开头的文件；推荐使用 Git 或 GitHub Desktop 上传整个目录。
4. 默认分支使用 **`main`**。如果使用其他分支，请修改 workflow 中的 `branches: [main]`。
5. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
6. 如果第一次推送发生在启用 Pages 之前，可以进入 **Actions → Deploy academic homepage to GitHub Pages → Run workflow** 手动运行一次。
7. 等工作流成功后，在 **Settings → Pages → Visit site** 打开网站。更新可能需要几分钟。

工作流会检查 JSON 语法，只复制 `index.html`、`css/`、`js/`、`data/`、`assets/` 和 `.nojekyll` 到发布目录，然后上传、部署；不需要 npm、Node.js 构建或额外密钥。GitHub Actions 中用于部署的工具由 GitHub 提供，不是网站运行依赖。

部署设置和工作流依据 [GitHub 官方自定义工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。仓库命名规则见 [创建 GitHub Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

### 使用 Git 上传（可选）

先创建上面要求的空仓库。如果 GitHub 创建仓库时自动添加了 README，请先克隆仓库，再将这些文件复制进去，以免遇到不同提交历史。

在本项目文件夹运行以下命令，将 `USERNAME` 替换成你的用户名：

```powershell
git init
git add .
git commit -m "Create academic homepage"
git branch -M main
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git push -u origin main
```

GitHub 登录由 Git / GitHub Desktop 引导完成，不要把密码或令牌写到配置文件。

### 日常更新

修改 `data/profile.json`，本地预览确认后保存、提交、推送到 `main`。工作流会自动重新部署。也可以在 GitHub 网页直接编辑 JSON 并提交。

若使用普通仓库名（例如 `academic-homepage`），网站会位于 `https://USERNAME.github.io/academic-homepage/`，本项目的相对路径也支持这种方式。但要得到无子路径的网址，必须使用 `username.github.io` 仓库。

## 4. 验收与排查

- 点击 About、Publications、Projects、Awards、Service，确认选中状态和内容切换正确。
- 调整窗口大小，或在手机浏览器打开，确认没有横向溢出。
- 把一个列表设为空数组，确认默认隐藏；Publications 和 Awards 有空栏目提示配置时应保留，清空提示后应隐藏。
- 把头像或项目图片路径改为不存在的文件，确认占位效果正常。
- 临时修改 JSON 使其无效，确认出现错误和重试按钮；恢复合法 JSON 后点击重试。
- 检查自己的邮箱、Google Scholar、GitHub、CV 和每篇论文的资源链接。程序验证链接格式与协议，不能保证第三方网站内容仍然存在。

| 问题 | 排查方式 |
| --- | --- |
| 双击文件后资料加载失败 | 用本地服务器预览，不要使用 `file://` |
| GitHub 上 404 | 检查仓库名、Pages Source、分支和 Actions 结果 |
| CSS、图片或 JSON 404 | 检查大小写、文件是否上传以及相对路径 |
| JSON 解析失败 | 检查引号、逗号、括号；运行 `python -m json.tool` |
| 修改后看不到更新 | 等 Actions 完成，再刷新；必要时强制刷新浏览器 |
| 没有 PDF 按钮 | `links.pdf` 为空或不是受支持的地址；填写路径并上传文件 |
| 栏目消失 | 对应列表为空，或条目缺少主字段；Publications / Awards 可通过 `site.emptySectionMessages` 保留空栏目 |

## 5. 维护约定

个人信息只存放在 JSON，样式只修改 CSS，页面行为只修改 JavaScript。可配置文字全部采用 DOM 的 `textContent` 或文本节点渲染；链接仅允许 HTTP、HTTPS 和联系链接中的 `mailto:`，会拒绝 `javascript:`、`data:` 等协议。新窗口链接使用 `noopener noreferrer`。

网页无访问统计、无远程字体、无浏览器端依赖。头像、论文和 CV 使用本地静态文件即可。当前个人配置中的获奖来自用户提供的证书，仅公开奖项名称、机构、年份和简短说明；证书原件保留在用户本地，不属于网站发布文件。没有相应真实经历时继续使用空数组，新增经历时只填写自己的真实资料。

开发阶段的本地检查不等于远程部署验收。当前仓库已上传并启用 Pages，首次 GitHub Actions 部署已成功；公开网址为 `https://yi-123-ii.github.io/`。后续更新仍应检查 Actions 结果，并打开网址确认。

## 6. 本次开发检查

已使用本地 HTTP 服务器和浏览器检查：

- 桌面、768px 平板、390px 和 320px 手机布局，未发现横向溢出。
- 五个栏目切换、当前导航选中状态、浏览器后退、栏目链接。
- 空列表和空条目的隐藏，以及全部内容为空时的提示。
- 论文年份倒序排列，以及无年份条目放到最后。
- 图片加载失败的头像、项目图占位效果。
- JSON 无效、JSON 不存在时的提示，以及修正配置后的重试恢复。
- HTML / script 字符串按纯文本显示，危险协议链接被过滤。
- JavaScript 语法、JSON 语法，以及 8 个本地资源的 HTTP 200 响应。
- 示例 PDF 的结构、文字和页面渲染。
- 本次栏目更新已检查桌面及 320px 手机布局、Publications / Awards 切换与后退、有内容时替换提示、清空提示时隐藏栏目，以及三项真实获奖的年份顺序。
- 英文奖项及简介链接更新已检查：三个简介链接的地址与新窗口保护、普通文字段落兼容、带链接段落的安全文本渲染、危险协议过滤、空段落忽略，以及 320px 宽度下简介无横向溢出。
- 简洁奖项和邮件模式更新已检查：奖项只显示名称与年月、页面正文无中文翻译、JSON 错误提示为英文、Gmail 链接的收件人和新窗口属性、默认邮件应用模式兼容，以及 320px 宽度无横向溢出。Gmail 登录后的实际发信流程不属于网站测试，也未发送测试邮件。
- 后续日期布局调整已检查：每项依次显示名称、单位、日期三行；日期采用 14px 正文颜色；三项日期为 Jun. 2026、Jun. 2026、Oct. 2025；桌面和 320px 手机均无横向溢出，带版本参数的 CSS / JavaScript 资源返回 HTTP 200。

浏览器检查使用独立的临时配置，位于 `.qa/`，该目录已被 Git 忽略，也不会被工作流发布。首次真实 GitHub Actions 部署已成功；远程网页的浏览器核验曾因网络超时未完成，也未进行所有浏览器或真实手机设备的兼容性测试。
