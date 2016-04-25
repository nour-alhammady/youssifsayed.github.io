/**
 * youssif sayed blog <http://youssifsayed.github.io/> *
 @copyright: youssif sayed<sayedgyussif@gmail.com> 2016, under MIT licence.
*/

"use strict";
const fs     = require("fs"),
	gulp     = require("gulp"),
	gulpSCSS = require("gulp-sass"),
	xml      = require("xml"),
	ejs      = require("ejs"),
	path     = require("path"),
	posts    = require(`${__dirname}/postsMap.json`),
	siteurl  = "http://youssif.me/",
	config   = {
		blogname: "مدونة يوسف سيد",
		blogdescription: "مدونة شخصية ذات ميول برمجيِّة.",
		blogurl: siteurl
	},
	createConfig      = () => { return Object.create(config) }, // clone config
	marked            = require("marked"),
	highlight         = require("highlight.js"),
	prism             = require('prismjs'),
	markdownCache     = [],
	ReadPostOnIndexTo = /[^\.]+\./,
	postsInpage       = 4,
	mkReander         = new marked.Renderer(),
	out               = `${__dirname}/gh_pages`,
	indexs            = [], 
	rss               = [{ _attr: {version: "2.0"}}]

// --- markdown ---
mkReander.heading = function (text, level) {
  var anchor = text.replace(/ /g, '-');

  return ejs.render(`<h${level}><a href="#<%= anchor %>" class="anchor" name="<%= anchor %>">
  					<%= text %></a></h${level}>`, {text: text, anchor: anchor});
}
mkReander.image = function(href, title, text) {
	var base  = `${siteurl}/resource/post-img/`,
		text  = text ? ' alt="' + text + '"' : "",
		title = title ? ' title="' + title+ '"' : "";
   return `<img src='${href.match(/^http:\/\//i) ? href : base + href}'${text}${title}>`;
}
marked.Lexer.rules.gfm.heading = marked.Lexer.rules.normal.heading;
marked.Lexer.rules.tables.heading = marked.Lexer.rules.normal.heading;
marked.setOptions({
	highlight: function (code, lang) {
		if (typeof prism.languages[lang] == "undefined"){
			try {
				require('prismjs/components/prism-' + lang + '.js');
			} catch (e) {
				console.log(lang+" not found.")
				return code;
			}
		}
		return prism.highlight(code, prism.languages[lang]);
	},
	langPrefix: "language-",
	renderer: mkReander,
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: true,
	smartLists: true
})
function markdown(file) {
	if (typeof markdownCache[file] == "string") return markdownCache[file]
	
	var fileContent = fs.readFileSync(`${__dirname}/posts-md/${file}`, "utf-8")
	
	markdownCache[file] = marked(fileContent)
	
	return markdownCache[file] || ""
}


gulp.task("default", ["setup", "index", "tags", "posts", "extra", "theme.scss", "sitemap"])

// make directory if not exist.
function mkdirP(dir) {
	try {
		fs.accessSync(dir, fs.F_OK);
	} catch (e) {
		return fs.mkdirSync(dir);
	}
}

// create required build directories.
gulp.task("setup", function () {
	mkdirP(out)
	mkdirP(`${out}/tag`)
	mkdirP(`${out}/index`)
	mkdirP(`${out}/post`)
	mkdirP(`${out}/tag`)
})

function postHTMLName(name) {
	return name.replace(/\s/g, '-') + '.html'
}

function postRender(post, full) {
	full = !!full;
	var articleTemplate = fs.readFileSync(`${__dirname}/templates/article.ejs`, "utf8"),
	    postConfig      = createConfig(),
		HTMLContent     = (full && markdown(post.post)) ||
						  (post.description && `<p>${post.description}</p>`) || 
						  (typeof post.post == "string" && post.post.length > 0 
						  ? markdown(post.post).match(post.readPostOnIndexTo ? new RegExp(post.readPostOnIndexTo, "i") : ReadPostOnIndexTo)[0] : ""),
		externalLink    = "",
		readMoreTitle   = "أكمل المقال"

	postConfig.postTitle      = post.title
	postConfig.postTags       = typeof post.tags == "string" ? 
								post.tags.split(" ") : []
	postConfig.postImage      = post.img
	postConfig.articleContent = HTMLContent
	postConfig.postDate       = post.date

	if (!full) {
		if (typeof post.link == "object") {
			if (typeof post.link.link == "string") externalLink = post.link.link
			readMoreTitle = post.link.title || readMoreTitle
		}

		postConfig.postLink = externalLink.length ? externalLink : 
								`${siteurl}post/${postHTMLName(post.name)}`
		postConfig.readMore = readMoreTitle
	} else { postConfig.readMore = "" }
	
	return {content: ejs.render(articleTemplate, postConfig), data: postConfig} 
}

function writeIndexs(done, posts, writeTo, title) {
	var indexConfig      = createConfig(),
		headerTemplate   = fs.readFileSync(`${__dirname}/templates/header.ejs`, "utf8"),
		indexTemplate    = fs.readFileSync(`${__dirname}/templates/index.ejs`, "utf8"),
		footerTemplate   = fs.readFileSync(`${__dirname}/templates/footer.ejs`, "utf8"),
		size             = parseInt((posts.length / postsInpage + (posts.length
						 % postsInpage > 0 && 1)).toString()), indexHtml

	indexConfig.activedList = "blog";
	indexConfig.header      = ejs.render(headerTemplate, indexConfig)
	indexConfig.articles    = []
	indexConfig.pageTitle   = title || ""
	indexConfig.footer      = ejs.render(footerTemplate)

	for (let i=0; i < size; i++) {
		let postsHTML = [],
			filename  = `${writeTo}/index${i > 0 ? '-' + (i+1) : ''}.html`
		
		for (let pi=0; pi < postsInpage; pi++) {
			let post        = posts[(i * postsInpage) + pi];
			if (typeof post  == "undefined") break;
			
			postsHTML.push(postRender(post).content)
		}
		
		indexConfig.articles = postsHTML
		indexHtml            = ejs.render(indexTemplate, indexConfig)
	
		indexs.push((siteurl.replace(/\/$/i, "") + path.resolve(filename).replace(path.resolve(out), "")).replace(/(\\)+/g, '/'))
	
		fs.writeFileSync(`${filename}`, indexHtml)
	}
	done()
}

gulp.task("index", function (done) {
	var copy = () => {
		fs.createReadStream(`${out}/index/index.html`).pipe(fs.createWriteStream(`${out}/index.html`))
		done()
	}
	
	rss.push({
		channel: [
			{ author: "Youssif Sayed <sayedgyussif@gmail.com>" },
			{ title: config.blogname },
			{ description: config.blogdescription },
			{ link: siteurl }
		]
	})
	
	writeIndexs(copy, posts, `${out}/index/`)
})

gulp.task("tags", function (done) {
	var tags     = {},
		doneSize = 0;
	var Done = () => {
			doneSize++;
			if (doneSize == tags.length) done()
		}
	
	for (let post of posts) {
		if (typeof post.tags != "string" && post.tags.length < 1) continue;
		let tagslist = post.tags.split(" ")
		
		for (let tag of tagslist) {
			if (typeof tags[tag] != "object") tags[tag] = [];
			
			tags[tag].push(post);
		}
	}
	
	for (let tag in tags) {
		let tagDir   = `${out}/tag/${tag}`;
		
		mkdirP(tagDir)
		
		writeIndexs(Done, tags[tag], tagDir, tag)
	}
})

gulp.task("posts", function (done) {
	var postsConfig 	 = createConfig(),
		postTemplate     = fs.readFileSync(`${__dirname}/templates/post.ejs`, "utf8"),
		headerTemplate   = fs.readFileSync(`${__dirname}/templates/header.ejs`, "utf8"),
		footerTemplate   = fs.readFileSync(`${__dirname}/templates/footer.ejs`, "utf8"),
		index            = posts.length;
		
		
	postsConfig.activedList = "blog"
	postsConfig.header      = ejs.render(headerTemplate, postsConfig)
	postsConfig.footer      = ejs.render(footerTemplate, postsConfig)
	
	for (let post of posts) {
		if (!post.name) continue; // external post
		
		let postConfig = Object.create(postsConfig),
			name       = postHTMLName(post.name),
			postData   = postRender(post, true)
		
		postConfig.pageTitle       = post.title;

		postConfig.postContent     = postData.content
		postConfig.postDescription = fs.readFileSync(`${__dirname}/posts-md/${post.post}`, "utf-8").match(typeof postConfig.readPostOnIndexTo !== "string" ?
									 new RegExp(post.readPostOnIndexTo, "i") : ReadPostOnIndexTo)[0]

		if (index < 6) {
			rss.push({
				"item": [
					{ title: postConfig.pageTitle },
					{ link: `${siteurl}post/${postHTMLName(post.name)}` },
					{ description: postConfig.postDescription },
				]
			})
		}

		fs.writeFileSync(`${out}/post/${name}`, ejs.render(postTemplate, postConfig))
		
		index--
	}
	done()
});

gulp.task("extra", function (done) {
	var pgconfig          = createConfig(),
		connectmeTemplate = fs.readFileSync(`${__dirname}/templates/connectme.ejs`, "utf8"),
		readmeTemplate    = fs.readFileSync(`${__dirname}/templates/readme.ejs`, "utf8"),
		headerTemplate    = fs.readFileSync(`${__dirname}/templates/header.ejs`, "utf8"),
		footerTemplate    = fs.readFileSync(`${__dirname}/templates/footer.ejs`, "utf8")
	
	pgconfig.footer      = ejs.render(footerTemplate, pgconfig)
	pgconfig.activedList = "connectme";
	pgconfig.header      = ejs.render(headerTemplate, pgconfig)
			
	fs.writeFileSync(`${out}/connectme.html`, ejs.render(connectmeTemplate, pgconfig))
	
	pgconfig.activedList = "readme"
	pgconfig.header      = ejs.render(headerTemplate, pgconfig)
	
	fs.writeFileSync(`${out}/readme.html`, ejs.render(readmeTemplate, pgconfig))
	
	done()
})

gulp.task("rss", function () {
	fs.writeFileSync(`${out}/rss.xml`, '<?xml version="1.0" encoding="UTF-8"?>\n' + xml({
		"rss": rss
	}))
})

gulp.task("sitemap", ["rss"], function () {
	var urlset    = [{ _attr: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }}],
		urlsList = indexs.concat([
			`${siteurl}`,
			`${siteurl}connectme.html`,
			`${siteurl}readme.html`
		])
	
	
	for (let post of posts) {
		let name = post.name
		if (typeof name == "string") {
			urlsList.push(`${siteurl}post/${postHTMLName(name)}`)
		}
	}
	
	for (let url of urlsList) {
		urlset.push({url: [{loc: url}]})
	}
	
	
	fs.writeFileSync(`${out}/sitemap.xml`, '<?xml version="1.0" encoding="UTF-8"?>\n' + xml({
		"urlset": urlset
	}))
	fs.writeFileSync(`${out}/sitemap.txt`, urlsList.join("\n"))
})

gulp.task("theme.scss", function () {
	gulp.src(`${__dirname}/resource/css/theme.scss`)
	.pipe(gulpSCSS())
	.pipe(gulp.dest(`${__dirname}/resource/css/`))
})