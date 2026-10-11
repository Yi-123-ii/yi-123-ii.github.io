"use strict";

// Personal content belongs in data/profile.json. This file only renders it.
(() => {
  const profile = document.querySelector("#profile");
  const navigation = document.querySelector("#navigation");
  const sections = document.querySelector("#sections");
  const status = document.querySelector("#status");
  const footer = document.querySelector("#footer");
  let availableSections = [];

  const text = value => typeof value === "string" ? value.trim() : "";
  const strings = value => Array.isArray(value) ? value.map(text).filter(Boolean) : [];
  const records = (value, field) => Array.isArray(value)
    ? value.filter(item => item && typeof item === "object" && !Array.isArray(item) && text(item[field]))
    : [];

  // All configurable text is assigned through textContent, never parsed as HTML.
  function element(tag, className = "", content = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  }

  function safeURL(value, allowEmail = false) {
    const raw = text(value);
    if (!raw || /[\u0000-\u0020\u007f]/.test(raw)) return null;
    try {
      const url = new URL(raw, document.baseURI);
      if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return url.href;
      if (allowEmail && url.protocol === "mailto:") return url.href;
    } catch { /* Invalid URLs are omitted instead of becoming broken links. */ }
    return null;
  }

  // These SVG paths are fixed UI icons, never supplied by the JSON configuration.
  function icon(name) {
    const paths = {
      email: ["M3 5h18v14H3z", "m3 6 9 7 9-7"],
      github: ["M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.7-.5-2.5 3-.3 6-1.5 6-5.5 0-1.5-.5-2.5-1.5-3.5.2-1 .2-2-.2-3-1.7 0-2.9.7-3.8 1.4a13 13 0 0 0-6 0C8.1 2.7 6.9 2 5.2 2c-.4 1-.4 2-.2 3C4 6 3.5 7 3.5 8.5c0 4 3 5.2 6 5.5-.6.8-.5 1.5-.5 2.5V21"],
      scholar: ["m2 9 10-6 10 6-10 6z", "M6 12v6c4 3 8 3 12 0v-6", "M22 9v9"],
      cv: ["M6 3h8l4 4v14H6z", "M14 3v5h4", "M9 12h6M9 16h6"],
      link: ["M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2", "M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2"],
      external: ["M14 3h7v7", "m10 14 11-11", "M10 3H3v18h18v-7"],
      person: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M4 21v-2a8 8 0 0 1 16 0v2"]
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.7");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    for (const d of paths[name] || paths.link) {
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", d);
      svg.append(path);
    }
    return svg;
  }

  function link(label, value, className = "", allowEmail = false) {
    const url = safeURL(value, allowEmail);
    if (!url) return null;
    const anchor = element("a", className, label);
    anchor.href = url;
    if (!url.startsWith("mailto:")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  function picture(value, alt, className, avatar = false) {
    const frame = element("div", className);
    const fallback = () => {
      frame.replaceChildren(avatar ? icon("person") : element("span", "", "Image unavailable"));
      frame.setAttribute("role", "img");
      frame.setAttribute("aria-label", avatar ? "Profile photo unavailable" : alt || "Project image unavailable");
    };
    const url = safeURL(value);
    if (!url) { fallback(); return frame; }
    const img = element("img");
    img.alt = alt;
    img.decoding = "async";
    if (!avatar) img.loading = "lazy";
    img.addEventListener("error", fallback, { once: true });
    img.src = url;
    frame.append(img);
    return frame;
  }

  function renderProfile(data) {
    const person = data.person;
    const heading = element("div", "profile-heading");
    heading.append(element("h1", "profile-name", text(person.name)));
    if (text(person.nameLocal)) heading.append(element("p", "local-name", text(person.nameLocal)));
    profile.append(picture(person.photo, text(person.photoAlt) || `${text(person.name)} — profile photo`, "avatar", true), heading);

    const identity = element("div", "identity");
    for (const field of ["role", "affiliation"]) {
      if (text(person[field])) identity.append(element("p", "", text(person[field])));
    }
    if (identity.childElementCount) profile.append(identity);

    const interests = strings(data.about?.researchInterests);
    if (interests.length) {
      const summary = element("div", "research-summary");
      summary.append(element("h2", "sidebar-label", "Research"), element("p", "interests-summary", interests.join(" · ")));
      profile.append(summary);
    }

    const contacts = element("ul", "contact-list");
    const email = text(person.email);
    const social = data.social || {};
    const items = [
      { label: "Email", url: email ? `mailto:${email}` : "", icon: "email" },
      { label: "GitHub", url: social.github, icon: "github" },
      { label: "Google Scholar", url: social.googleScholar, icon: "scholar" },
      { label: "CV", url: social.cv, icon: "cv" },
      ...records(social.additionalLinks, "label")
    ];
    for (const item of items) {
      const anchor = link(text(item.label), item.url, "contact-link", true);
      if (!anchor) continue;
      const box = element("span", "icon-box");
      box.append(icon(text(item.icon)));
      anchor.prepend(box);
      const li = element("li");
      li.append(anchor);
      contacts.append(li);
    }
    if (contacts.childElementCount) {
      const group = element("div", "contact-group");
      group.append(element("h2", "sidebar-label", "Connect"), contacts);
      profile.append(group);
    }
    const address = element("address", "address");
    for (const field of ["department", "location"]) {
      if (text(person[field])) address.append(element("p", "", text(person[field])));
    }
    if (address.childElementCount) profile.append(address);
    profile.hidden = false;
  }

  function block(title) {
    const node = element("div", "section-block");
    node.append(element("h3", "", title));
    return node;
  }

  function entryHeading(title, date, url, headingTag = "h3") {
    const heading = element("div", "entry-heading");
    const name = element(headingTag, "entry-title");
    name.append(link(title, url) || document.createTextNode(title));
    heading.append(name);
    if (date) heading.append(element("span", "entry-date", date));
    return heading;
  }

  function renderAbout(data) {
    const nodes = [];
    const paragraphs = strings(data.about?.paragraphs);
    if (paragraphs.length) {
      const bio = element("div", "biography section-block");
      paragraphs.forEach(paragraph => bio.append(element("p", "", paragraph)));
      nodes.push(bio);
    }
    const interests = strings(data.about?.researchInterests);
    if (interests.length) {
      const node = block("Research Interests");
      const list = element("ul", "interest-list");
      interests.forEach(interest => list.append(element("li", "", interest)));
      node.append(list);
      nodes.push(node);
    }
    for (const [field, label, titleKey, subtitleKey] of [
      ["education", "Education", "institution", "degree"],
      ["researchExperience", "Research Experience", "organization", "role"]
    ]) {
      const items = records(data[field], titleKey);
      if (!items.length) continue;
      const node = block(label);
      const list = element("div", "entry-list");
      for (const item of items) {
        const entry = element("article", "entry");
        entry.append(entryHeading(text(item[titleKey]), text(item.period), item.url, "h4"));
        if (text(item[subtitleKey])) entry.append(element("p", "entry-subtitle", text(item[subtitleKey])));
        if (text(item.description)) entry.append(element("p", "entry-description", text(item.description)));
        list.append(entry);
      }
      node.append(list);
      nodes.push(node);
    }
    return nodes;
  }

  const yearOf = item => /^\d{4}$/.test(String(item.year)) ? Number(item.year) : 0;

  function resources(values) {
    const list = element("div", "resource-links");
    for (const [label, url] of values) {
      const anchor = link(label, url, "resource-link");
      if (anchor) { anchor.append(icon("external")); list.append(anchor); }
    }
    return list.childElementCount ? list : null;
  }

  function renderPublications(data) {
    const papers = records(data.publications, "title").slice().sort((a, b) => yearOf(b) - yearOf(a));
    const groups = new Map();
    for (const paper of papers) {
      const year = yearOf(paper) ? String(yearOf(paper)) : "Other publications";
      if (!groups.has(year)) {
        const group = element("div", "year-group");
        group.append(element("h3", "year-heading", year));
        groups.set(year, group);
      }
      const entry = element("article", "entry publication");
      entry.append(element("h4", "entry-title", text(paper.title)));
      const authors = strings(paper.authors);
      if (authors.length) {
        const line = element("p", "authors");
        authors.forEach((author, index) => {
          if (index) line.append(document.createTextNode(", "));
          line.append(author === text(data.person.name) ? element("strong", "", author) : document.createTextNode(author));
        });
        entry.append(line);
      }
      if (text(paper.venue)) entry.append(element("p", "venue", text(paper.venue)));
      const links = resources([["PDF", paper.links?.pdf], ["Code", paper.links?.code], ["Project", paper.links?.project]]);
      if (links) entry.append(links);
      groups.get(year).append(entry);
    }
    return [...groups.values()];
  }

  function renderProjects(data) {
    return records(data.projects, "name").map(item => {
      const entry = element("article", "entry project");
      if (text(item.image)) {
        entry.classList.add("has-image");
        entry.append(picture(item.image, text(item.imageAlt) || text(item.name), "project-image"));
      }
      const body = element("div");
      body.append(entryHeading(text(item.name), yearOf(item) ? String(yearOf(item)) : ""));
      if (text(item.description)) body.append(element("p", "entry-description", text(item.description)));
      const technologies = strings(item.technologies);
      if (technologies.length) {
        const list = element("ul", "technology-list");
        technologies.forEach(technology => list.append(element("li", "", technology)));
        body.append(list);
      }
      const links = resources([["GitHub", item.github], ["Project", item.url]]);
      if (links) body.append(links);
      entry.append(body);
      return entry;
    });
  }

  function renderSimple(items, titleKey, dateKey, sortByYear = false) {
    const entries = records(items, titleKey).slice();
    if (sortByYear) entries.sort((a, b) => yearOf(b) - yearOf(a));
    return entries.map(item => {
      const entry = element("article", "entry");
      const date = dateKey === "year" ? (yearOf(item) ? String(yearOf(item)) : "") : text(item[dateKey]);
      entry.append(entryHeading(text(item[titleKey]), date, item.url));
      if (text(item.organization)) entry.append(element("p", "entry-subtitle", text(item.organization)));
      if (text(item.description)) entry.append(element("p", "entry-description", text(item.description)));
      return entry;
    });
  }

  function addSection(id, label, title, nodes, emptyMessage = "") {
    if (!nodes.length) {
      const message = text(emptyMessage);
      if (!message) return; // Empty sections stay hidden unless explicitly configured.
      nodes = [element("p", "empty-state", message)];
    }
    const section = element("section");
    section.id = id;
    section.hidden = true;
    section.setAttribute("aria-labelledby", `${id}-title`);
    const heading = element("h2", "section-title", title);
    heading.id = `${id}-title`;
    heading.tabIndex = -1;
    section.append(heading, ...nodes);
    sections.append(section);
    const anchor = element("a", "nav-link", label);
    anchor.href = `#${id}`;
    anchor.addEventListener("click", event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      activateSection(id, true);
    });
    navigation.append(anchor);
    availableSections.push(id);
  }

  function activateSection(requested, focus = false) {
    const active = availableSections.includes(requested) ? requested : availableSections[0];
    if (!active) return;
    for (const section of sections.children) section.hidden = section.id !== active;
    for (const anchor of navigation.children) {
      if (anchor.hash === `#${active}`) anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");
    }
    if (requested !== active) history.replaceState(null, "", `#${active}`);
    if (focus) document.getElementById(`${active}-title`).focus({ preventScroll: true });
  }

  function render(data) {
    if (!data || typeof data !== "object" || Array.isArray(data) || !text(data.person?.name)) {
      throw new Error("Please set person.name in data/profile.json. 请填写配置中的 person.name。");
    }
    const site = data.site || {};
    document.title = text(site.title) || `${text(data.person.name)} | Academic Homepage`;
    document.querySelector('meta[name="description"]').content = text(site.description) || strings(data.about?.paragraphs)[0] || "Academic personal homepage";
    if (/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(text(site.language))) document.documentElement.lang = text(site.language);
    renderProfile(data);
    addSection("about", "About", "About Me", renderAbout(data));
    addSection("publications", "Publications", "Publications", renderPublications(data), site.emptySectionMessages?.publications);
    addSection("projects", "Projects", "Projects", renderProjects(data));
    addSection("awards", "Awards", "Awards", renderSimple(data.awards, "name", "year", true), site.emptySectionMessages?.awards);
    addSection("service", "Service", "Service", renderSimple(data.service, "title", "period"));
    navigation.hidden = !availableSections.length;
    status.hidden = Boolean(availableSections.length);
    if (!availableSections.length) {
      status.replaceChildren(element("h2", "", "Profile coming soon"), element("p", "", "There is no content to display yet. / 暂无内容，欢迎稍后再来。"));
    }
    footer.append(element("span", "", `© ${new Date().getFullYear()} ${text(data.person.name)}`));
    if (text(site.updatedAt)) footer.append(element("span", "", `Last updated · ${text(site.updatedAt)}`));
    if (site.demo === true) footer.append(element("p", "demo-note", "Example profile only · 示例内容，请在发布前替换为自己的资料。"));
    footer.hidden = false;
    activateSection(location.hash.slice(1));
  }

  async function loadProfile() {
    document.body.className = "is-loading";
    profile.replaceChildren();
    navigation.replaceChildren();
    sections.replaceChildren();
    footer.replaceChildren();
    availableSections = [];
    profile.hidden = navigation.hidden = footer.hidden = true;
    status.hidden = false;
    status.replaceChildren(element("h1", "", "Academic Homepage"), element("p", "", "Loading profile… / 正在加载个人资料…"));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      if (location.protocol === "file:") throw new Error("Open this site with a local HTTP server. 请通过本地服务器打开，不能直接双击 index.html；启动方法见 README.md。");
      const response = await fetch("./data/profile.json", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(`Profile request failed (HTTP ${response.status}). 请检查 data/profile.json 的路径。`);
      const data = await response.json();
      render(data);
      document.body.className = "";
    } catch (error) {
      profile.hidden = navigation.hidden = sections.hidden = footer.hidden = true;
      document.body.className = "has-error";
      const message = error.name === "SyntaxError"
        ? "The profile JSON is invalid. 请检查双引号、逗号和括号；JSON 不能包含注释。"
        : error.name === "AbortError"
          ? "The request timed out. 网络请求超时，请检查连接后重试。"
          : error.message;
      status.replaceChildren(element("h1", "", "Unable to load profile / 资料加载失败"), element("p", "", message), element("p", "", "Please try again or contact the site owner. 请重试，或联系网站维护者。"));
      const retry = element("button", "retry-button", "Try again / 重试");
      retry.type = "button";
      retry.addEventListener("click", () => { sections.hidden = false; loadProfile(); });
      status.append(retry);
    } finally {
      clearTimeout(timeout);
    }
  }

  window.addEventListener("hashchange", () => activateSection(location.hash.slice(1)));
  window.addEventListener("popstate", () => activateSection(location.hash.slice(1)));
  loadProfile();
})();
