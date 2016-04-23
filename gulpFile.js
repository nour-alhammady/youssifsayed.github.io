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
	posts    = require(`${__dirname}/postsMap.json`),
	siteurl  = "http://youssif.me/",
	config   = {
		blogname: "مدونة يوسف سيد",
		blogdescription: "مدونة شخصية ذات ميول برمجيِّة.",
		blogurl: siteurl
	},
	createConfig      = () => { return Object.create(config) }, // clone config
	htmltidy 	      = require("htmltidy").tidy,
	marked            = require("marked"),
	highlight         = require("highlight.js"),
	htmlTidyOptions   = require("htmltidy-options"),
	prism             = require('prismjs'),
	markdownCache     = [],
	ReadPostOnIndexTo = /[^\.]+\./,
	postsInpage       = 4,
	mkReander         = new marked.Renderer()

mkReander.heading = function (text, level) {
  var anchor = text.replace(/ /g, '-');

  return ejs.render(`<h${level}><a href="#<%= anchor %>" class="anchor" name="<%= anchor %>">
  					<%= text %></a></h${level}>`, {text: text, anchor: anchor});
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
htmlTidyOptions["Kastor tidy - HTML page UTF-8"].doctype = "html5"

gulp.task("default", ["sitemap", "index", "tags", "posts", "extra", "theme.scss"])

function markdown(file) {
	if (typeof markdownCache[file] == "string") return markdownCache[file]
	
	var fileContent = fs.readFileSync(`${__dirname}/posts-md/${file}`, "utf-8")
	
	markdownCache[file] = marked(fileContent)
	
	return markdownCache[file] || ""
}

function postHTMLName(name) {
	return name.replace(/\s/g, '-') + '.html'
}

function postRender(post, full) {
	full = !!full;
	var articleTemplate = fs.readFileSync(`${__dirname}/templates/article.ejs`, "utf8"),
	    postConfig      = config,
		description     = (full && markdown(post.post)) ||
						  (post.description && `<p>${post.description}</p>`) || 
						  (typeof post.post == "string" && post.post.length > 0 
						  ? markdown(post.post).match(post.readPostOnIndexTo ? new RegExp(post.readPostOnIndexTo, "i") : ReadPostOnIndexTo)[0] : ""),
		externalLink    = "",
		readMoreTitle   = "أكمل المقال"

	postConfig.postTitle      = post.title
	postConfig.postTags       = typeof post.tags == "string" ? 
								post.tags.split(" ") : []
	postConfig.postImage      = post.img
	postConfig.articleContent = description
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
	
	return ejs.render(articleTemplate, postConfig)
}

function writeIndexs(done, posts, writeTo, title) {
	var indexConfig      = config,
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
		let postsHTML = []
		
		for (let pi=0; pi < postsInpage; pi++) {
			let post        = posts[(i * postsInpage) + pi];
			if (typeof post  == "undefined") break;
			
			postsHTML.push(postRender(post))
		}
		
		indexConfig.articles = postsHTML
		indexHtml            = ejs.render(indexTemplate, indexConfig)
		
		htmltidy(indexHtml, htmlTidyOptions["Kastor tidy - HTML page UTF-8"], (err, html) => {
			if (err)
				console.log(err)
			
			fs.writeFileSync(`${writeTo}/index${i > 0 ? '-' + (i+1) : ''}.html`, html)
			if (i+1 == size) done()
		})
	}
}

gulp.task("index", function (done) {
	var copy = () => {
		fs.createReadStream(`${__dirname}/index/index.html`).pipe(fs.createWriteStream(`${__dirname}/index.html`))
		done()
	}
	writeIndexs(copy, posts, `${__dirname}/index/`)
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
		let tagDir   = `${__dirname}/tag/${tag}`;

		try {
   			fs.accessSync(tagDir, fs.F_OK);
		} catch (e) {
			fs.mkdirSync(tagDir);
		}

		writeIndexs(Done, tags[tag], tagDir, tag)
	}
})

gulp.task("posts", function (done) {
	var postsConfig 	 = config,
		postTemplate     = fs.readFileSync(`${__dirname}/templates/post.ejs`, "utf8"),
		headerTemplate   = fs.readFileSync(`${__dirname}/templates/header.ejs`, "utf8"),
		footerTemplate   = fs.readFileSync(`${__dirname}/templates/footer.ejs`, "utf8"),
		length           = posts.length;
		
		
	postsConfig.activedList = "blog"
	postsConfig.header      = ejs.render(headerTemplate, postsConfig)
	postsConfig.footer      = ejs.render(footerTemplate, postsConfig)
	
	for (let post of posts) {
		if (!post.name) {
			length--;
			continue;
		}
		
		let postConfig = postsConfig,
			name       = postHTMLName(post.name)
		
		postConfig.pageTitle       = post.title;
		postConfig.postContent     = postRender(post, true)
		postConfig.postDescription = fs.readFileSync(`${__dirname}/posts-md/${post.post}`, "utf-8").match(typeof postConfig.readPostOnIndexTo !== "string" ?
									 new RegExp(post.readPostOnIndexTo, "i") : ReadPostOnIndexTo)[0]

		htmltidy(ejs.render(postTemplate, postConfig), htmlTidyOptions["Kastor tidy - HTML page UTF-8"], (err, html) => {
			if (err)
				console.log(err)
				
			fs.writeFileSync(`${__dirname}/post/${name}`, html)
			if (posts.indexOf(post) == length-1) done()
		})
	}	
});

gulp.task("extra", function (done) {
	var pgconfig          = config,
		connectmeTemplate = fs.readFileSync(`${__dirname}/templates/connectme.ejs`, "utf8"),
		readmeTemplate    = fs.readFileSync(`${__dirname}/templates/readme.ejs`, "utf8"),
		headerTemplate    = fs.readFileSync(`${__dirname}/templates/header.ejs`, "utf8"),
		footerTemplate    = fs.readFileSync(`${__dirname}/templates/footer.ejs`, "utf8"),
		onedone;
	
	pgconfig.footer      = ejs.render(footerTemplate, pgconfig)
	pgconfig.activedList = "connectme";
	pgconfig.header      = ejs.render(headerTemplate, pgconfig)
	
	htmltidy(ejs.render(connectmeTemplate, pgconfig), htmlTidyOptions["Kastor tidy - HTML page UTF-8"], (err, html) => {
		if (err)
			console.log(err)
			
		fs.writeFileSync(`${__dirname}/connectme.html`, html)
		if (onedone) done();
		onedone = true
	})
	
	pgconfig.activedList = "readme"
	pgconfig.header      = ejs.render(headerTemplate, pgconfig)
	
	htmltidy(ejs.render(readmeTemplate, pgconfig), htmlTidyOptions["Kastor tidy - HTML page UTF-8"], (err, html) => {
		if (err)
			console.log(err)
			
		fs.writeFileSync(`${__dirname}/readme.html`, html)
		if (onedone) done()
		onedone = true
	})
})

gulp.task("sitemap", function () {
	var urlset = [{ _attr: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }}]
	for (var post of posts) {
		let name = post.name
		if (typeof name == "string") {
			urlset.push({url: [{loc: `${siteurl}post/${postHTMLName(name)}`}]})
		}
	}
	fs.writeFileSync("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n' + xml({
		"urlset": urlset
	}))
})

gulp.task("theme.scss", function () {
	gulp.src(`${__dirname}/resource/css/theme.scss`)
	.pipe(gulpSCSS())
	.pipe(gulp.dest(`${__dirname}/resource/css/`))
})

gulp.task("clean", function () {
	fs.unlinkSync(`${__dirname}/index.html`)
	fs.unlinkSync(`${__dirname}/sitemap.xml`)
	for (var file of fs.readdirSync(`${__dirname}/post/`)) {
		fs.unlinkSync(`${__dirname}/post/${file}`)
	}
})