بدأت تسمع عن لغة TypeScript -المستخدمة من قبل Angular 2- في كل مكان؟، وترغب في التعرّف عليها، وما علاقتها بلغة JavaScript ولماذا قد يجب عليك أن تستخدمها؟
ستساعدك هذه السلسلة من المقالات في التعرّف على اللَّغة وخصائصها، وتعلّم الكتابة بها. في هذا الدَّرس سأتحدث عن الفرق بينها وبين JavaScript، ولماذا تستخدمها، وآلية التطوير بها. هذه السلسلة مقدمة لمن لا يجيد البرمجة، ويفضل أن يكون لديك معرفة ولو بسيطة بلغة JavaScript. لِنبدأ المقال بأهدافه:
1. التعريف بلغة TypeScript.
2. مواضع التشابه بين TypeScript وJavaScript.
3. أين تُستخدم TypeScript?
4. لماذا TypeScript!
5. إعداد بيئة TypeScript تثبيت (Node.js، وأدوات اللَّغة (المجمِّع ومدير الحزم)).
6. التعرف على ملفَّات المشروع ل TypeScript.

##تعريف

TypeScript هي لغةٌ برمجيَّةٌ  مترجمةٌ(تترجم إلى JavaScript). تتبع الإصدار السادس من مواصفة ECMAScript (ES6)، مع بعض الخصائص الخاصة للغة. هذه اللَّغة مُقدمة من Microsoft.
###مواصفة ECMAScript
كُتبتْ في الأصل مواصفة ECMAScript لتوحيد المعايير بين JavaScript وJScript(المستخدمة في IE)، يوجد منها عدِّة إصدارات مُختلفة ES3, ES5, ES6...، أغلب محركات JavaScript, Jscript صارت تدعم معظم خصائص الإصدار الخامس ES5، مع دعم بعض خصائص الإصدار السادس ES6، عمومًا. لأنَّ TypeScript الأخرى مُصمّمة على مواصفة ECMAScript(ES6) يفسر ذلك التشابه بين JavaScript وTypeScript؛ بحيث سيعمل -على الأرجح- أي ملف TypeScript بصيغة ts، كملفَّ JavaScript  ،والعكس؛ يتوقف ذلك على دعم مواصفة ES6 من قبل المحرك، واستخدام خصائص TypeScript الخاصة.
###أين تعمل TypeScript
حيث تعمل JavaScript تعمل TypeScript، سواءً في الوِب، Node.js، أو حتى [تطوير تطبيقات سطح مكتب](http://goo.gl/rmYltR) …، ويمكن اِستخدام شيفرات JavaScript بداخل شيفرات TypeScript، فقط ستحتاج إلى استدعاء ملفّات الإعلان لشيفرات JavaScript التي ستستخدمها بداخل TypeScript، واِنطلاقًا من الإصدار 1.8 سيمكنك تضمين شيفرات JavaScript مع TypeScript بسهولة.
##لماذا TypeScript
سيكون السؤال الآن "لماذا أستخدم TypeScript إن كانت JavaScript تفي بنفس الغرض؟، هذا بالإضافة إلى أنَّ TypeScript لن تنتج أي شيء خارج إطار JavaScript!"، صُمِّمتْ  TypeScript في الأصل لتستطيع كتابة شيفرات JavaScript بطريقة مثلى، بحيث ينتهي عمل TypeScript بعد مرحلة البناء، وما إن تصبح الشيفرة قابلة للتنفيذ بلغة JavaScript. هذه بعض المقارنات بين TypeScript وjavaScript الّتي قد تجعلك تكتب شيفرات JavaScript المستقبلية باِستخدام TypeScript:
###نظام الأنواع
تأتي TypeScript بنظام أنواع من نوع Strongly Typed؛ يساعد ذلك على اِختبار عمل الشيفرة في وقت البناء والتوقع بعمل النظام بشكل صحيح.
####لماذا تحتاج شيفرة JavaScript إلى أنواع؟
#####التأكد من الإدخال الصحيح
عند كتابة وظيفة بلغة JavaScript فلا يمكن ضمان إدخال نوع مُعيَّن من البيانات، وسيتوجب كتابة بعض الشيفرات الإضافية للوظيفة للتأكد من عملية الإدخال الصحيح؛ لكي تتوقع عمل الشيفرة بشكل صحيح، وعدم حدوث أخطاء -من المفسر- في جميع الحالات، يكون الأمر أكثر إزعاجًا إن أردنا التأكد من إدخال نوع صنف معين؛ بحيث سيتوجب عليك التأكد من كل تابع على حدى، والتأكد من أنه صنف أولًا. مع أنَّ لغة TypeScript لا يمكنها التأكد من الإدخال الصحيح للأنواع بعد أن تترجم شيفرتها إلى JavaScript؛ إلا أنها توَّفر التأكد من الإدخال الصحيح أثناء تطوير الشيفرة -مرحلة الكتابة بلغةTypeScript. لنأخذ مثالًا على ذلك:
شيفرة TypeScript:

```typescript
	// وجه
	interface Point{
		X: number,
		Y: number
	}
	
	function drawPoint (canvas: HTMLCanvasElement, point: Point): void {
		var context: CanvasRenderingContext2D = canvas.getContext("2d");
		context.fillStyle = "#f13cab";
		context.fillRect(point.X, point.Y, 2, 2);
	}
	
	var test = document.createElement("canvas");
	
	// مثال على إستخدامات صحيحة
	drawPoint(test, {X: 13, Y: 13})
	
	// إستخدامات غير صحيحة
	drawPoint({31, 31}); // خطأ
	drawPoint(document.createElement("div"), 31, 31); // خطأ لا يُمكن إدخال عنصر div
	drawPoint(test, {X: 31}) // خطأ
```

لعمل شيء مثل السابق بلغة JavaScript سنكتب بعض الأسطر الإضافية إلى الشيفرة للتأكد من إدخال جميع العناصر المطلوبة إلى الدَّالّة  drawPoint، والتأكد من إدخال عنصر رسم canvas،…
#####مغالطات الأنواع المنطقية في JavaScript
نظام الأنواع في JavaScript من نوع Weekly Type؛ لِذا ستجد الكثير من المغالطات المنطقية، لنأخذ مثالًا على ذلك سنعرف متغيران أحدهما رقم والآخر رقم بداخل سلسلة نصيِّة، بلغة JavaScript:

```javascript
	var str = "14";
	var num = 2;

	console.log(typeof str); // -> string
	console.log(typeof num); // -> number
```
حتى الآن كل شيء يبدواْ صحيحًا؛ سيكون من غير المنطقي القيام ببعض المعاملات الرياضية بين هذين المتغيرين، لكنه في لغة JavaScript أمر صحيح:

```javascript
	console.log(str * num); // -> 28 
```
حسنًا، يتضح مما سبق أنَّه يمكن ضرب رقم في هيِّئة سلسلة نصيِّة مع رقم آخر، لكن ماذا عن باقي المعاملات:

```javascript
	console.log(str - num); // -> 12
	console.log(str / num); // -> 7
	console.log(str % num); // -> 0
	console.log(str + num); // -> 142
```
ثم، 

```javascript
	console.log(++str); // -> 15 
	// str رقم أم سلسلة رقميِّة :)!
```
####نظام الأنواع اختياري
في بعض الحالات لا يمكن معرفة ما هو النوع الصحيح الواجب استخدامه،  في حالة اِستخدم مكتبة من طرف ثالث مثلًا. وقد تكون لا تفضل الكتابة بنظام أنواع لكنك تريد مميزات TypeScript الأخرى، الأنواع في TypeScript هي اختيارية؛ فيمكن الإعلان عن متغير باِستخدام النوع any بحيث سيقبل أي نوع من البيانات:

```typescript
	var notTyped: any = 31;
	notTyped = '32';
```
بالإضافة إلى أنه يمكن الإعلان عن متغيِّر بدون نوع، وسيحدد المترجم النوع في مرحلة التفسير:

```javascript
	var num = 31;
	// تمامًا كمثل var num: number = 31;
	num = '32'; // خطأ
```
###مستقبل JavaScript الآن
تحدثنا في أول المقال عن مواصفة ECMAScript، وعلمنا أنَّ أغلب محركات JavaScript -حتى وقت كتابة هذا المقال- تدعم أغلب خصائص الإصدار الخامس من هذه المواصفة(ES5)، مع بعض من خصائص الإصدار السادس ES6. قدمت مواصفة ECMAScript في الإصدار السادس العديد من المميزات منها من حل بعض المشاكل كالدِّوال السهمية، ومنها من قدم مميزات تفتقر JavaScript إليها كالأصناف،  لكن حتى الآن لا يمكن كتابة شيفرات JavaScript تعتمد على ES6 بشكل كامل؛ لإنها لن تعمل على الكثير من محركات JavaScript.
وتحدثنا أنَّ لغة TypeScript تتبع مواصفة ES6 مع بعض الخصائص الخاصة؛ مع هذا فإنها توِّفر جعل شيفرة JavaScript الناتجة تتبع الإصدار ES3, ES5 أو ES6، إن كان يُمكن ذلك؛ فيوجد بعض الخصائص الَّتي لا يُمكن ترجمتها إلى جميع الإصدارات، كمثل وظائف الوصول(accessors method) لا يُمكن ترجمتها إلى ES3، ولا تقتصر TypeScript على دعم مواصفة ES6 والأنواع فقط، فتدعم بعض الخصائص الأخرى منها ما هو خاص باللّغة كمثل الأنواع المعددة(Enumerated Type) كلغة c و c#: 

```typescript
	enum COLORS { RED = 1, BLUE /** 2 */}
```
ومنها ما سيأتي مستقبلًا في إصدارات قادمة من ECMAScript كمثل معاملة الرفع(**)، وزخرفة(decorator) الوظائف في ES7، مثالًا على كليهما:

```typescript
	// دالّة ستحول عنصر الوصول num في الصنف C لكي يرجع مربع الرَّقم.
	function Cube(target: C, propertyKey: string, descriptor: PropertyDescriptor) {
		let getter = descriptor.get; // حفظ وظيفة الوصول الَّتي تجلب الرَّقم
		descriptor.get = function() { // التعديل عليها بحيث ترجه مربعه بدلًا منه
			return getter.call(this) ** 2;
		}
	}

	class C { // صنف
		@Cube // زخرفة الوظيفة
		get num(): number {
			return this._number
		}
		set num (num: number) {
			this._number = num
		}
		
		constructor (public _number: number){}
	}
	// تجربة
	var c = new C(3)
	console.log(c.num) // -> 9
	console.log((c.num = 2) && c.num) // -> 4
```
###صياغة React
تدعم TypeScript بشكل افتراضي صياغة React الخاصة بصنع واجهة المستخدم للويب، وتدعم أيضًا إمكانية ترجمة الشيفرة إلى شيفرات JavaScript عادية قابلة للتنفيذ، أو صياغة JSX تحتاج إلى منفذ:

```typescript
	import * as React from "react";

	class UserWidget extends React.Component<{name: string, profile: string}, {}> {
		constructor(props, state) {
			super(props, state)
		}
		
		render () {
			return (
				<div className="userProfile">
					<img src={this.props.profile}/>
					<p>{this.props.name}</p>
				</div>
			)
		}
	}
```
##إعداد بيئة TypeScript 
سنثبت أولًا مجمِّع TypeScript، وهو يتوفر للتثبيت بداخل بيئة Visual Studio، أو من خلال مدير حزم Node.JS أو كما يُسمى اختصارًا NPM، سنتحدث عن تثبيت المجمِّع  من خلال NPM فقط، لأنه متعدد المنّصات ليس لمستخدمي نظام ويندوز فقط ولأني لا أحبُّ Visual Stud$$ :)، لِنهمُّ بتثبيت Node.JS،
###تثبيت Node.JS 
لتثبيت Node.JS استعمل [معالج التثبيت الرسمي](https://nodejs.org/en/#download) في حال ما كنت تَستخدم نظام التشغيل Windows أو Mac OS، أما في حال عملك على نظام لينكس فقم بتثبيتها من خلال [مدير الحزم في نظامك](https://nodejs.org/en/download/package-manager/).
###تنصيب أدوات TypeScript
عبر NPM ثبِّت الحزمة TypeScript -بشكل عام، نَفِّذ هذا الأمر:

```bash
    npm install typescript -g
```
الحزمة TypeScript تحتوى على هتين الأداتين: 
1. مُجمِّع TypeScript(tsc).
2. مدير حزم TypeScript(tsd)، مُنصب ملفّات الإعلان للحزم، إن تتذكر أول المقال، الملفّات المسؤولة عن الإعلان عن شيفرات JavaScript، لتستخدم بداخل TypeScript بشكل صحيح، سنتحدث عن الأمر مرة أخرى :) في موضوع لاحق بشكل أوسع -إن شاء الله.
للتأكد من تنصيب TypeScript بشكل صحيح نَفِّذ هذا الأمر: 

```bash
    tsc -v
```
يجب أن يُخَرِّج إصدار TypeScript المُنصَّب، حتى وقت كتابة هذا المقال كان الإصدار هو 1.7.5؛ مع ذلك سنشرح  في دروس هذه السلسلة خصائص اللغة حتى الإصدار 2.1.0 سنشير إلى إصدار TypeScript مع كل خاصية -بإذن الله، يمكنك الحصول على آخر إصدار متوَّفر للتجربة، -ليس للإنتاج قد تحدث مشاكل غير متوقعة من استخدامه، عبْر:

```bash
	npm install typescript@next
```
##تجميع شيفرة TypeScript
كتجربة على اِستخدام مجمّع TypeScript، وتنفيذًا لرغبتي في كتابة شرح أهلًا بالعالم:)، من خلال محررك المُفضل -سيكون أفضل لو تستخدم مُحرِّر يدعم TypeScript؛ لكي يساعدك على حل الإخطاء ومساعدتك بالكتابة، محرّر مثل visual studio code(مجاني عابر للمنصات من ميكروسوفت، يدعم العربية) أو atom مع تنصيب إضافة TypeScript. اِفتح ملف باسم hello.ts وضع به:

```typescript
	var hello: string = "Hello, World.";
	console.log(hello);
```
من ثم اِتجه بسطر الأوامر إلى المجلد الّذي حفظتَ به الملفّ، ونفِّذ:

```bash
	tsc hello.ts
```
سينتج ملفّ JavaScript قابل للتنفيذ باسم hello.js؛ فور الانتهاء من العملية السابقة، يمكننا تنفيذ هذا الملفّ باستخدام Node.js، كالتالي:

```bash
	node hello.js
```
ملاحظات 
1. إن أردتَ تحديد اسمًا لملفّ JavaScript الناتج اِستخدم الإعداد -out؛ بحيث يكون عملية سطر الأوامر كالتالي `tsc hello.ts - out helloWorld.js`.
2. إن أردتَ تحديد مواصفة ECMAScript لملفّ JavaScript الناتج استعمل الإعداد -target، بشكل اِفتراضي تكون ES3، كما تحدثنا لا يمكن ترجمة جميع الخصائص إليها لذا ستحتاج إلى استخدام إصدارًا أعلى كمثل ES5. كلما زاد الإصدار؛ كلما قل حجم الشيفرة الناتجة.
باقي [إعدادات المجمِّع](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options).



##ملفَّات الإعداد tsconfig.json
###ما هي ملفات الإعداد ولماذا نحتاج إليها؟
يحتوي ملفّ الإعداد على قائمة بملفات TypeScript التي ستترجم، وإعدادات مجمِّع TypeScript في صياغة شبيهة بJSON. الحاجة إلى ملفّ الإعداد مع كل مشروع TypeScript ليست إجبارية، إلا أنك سيجب عليك -بدون استخدام ملف الإعداد- كتابة قائمة الملفّات الخاصة بمشروعك، بالإضافة إلى إعدادات المجمِّع إن وجدت مع كل مرة ستبني فيها المشروع، وعند محاولة بناء المشروع من قبل مطوِّر آخر عليه أن يخمن إعدادات المجمِّع الّتي اِستخدمت والملفات الَّتي ستترجم!.
يتكون ملفِّ الإعداد من ثلاث خواص:
1. إعدادات المجمِّع(compilerOptions): مجموعة من إعدادات مجمِّع TypeScript، الَّتي تحدثنا عنها قبلًا.
2. ملفَّات المشروع(files): قائمة بملفات المشروع، يجب كتابة الملفّات جميعها بشكل متتالي، لا يُنصح به في حال المشاريع الكبير؛ لأنك ستحتاج إلى كتابة قائمة بجميع ملفات المشروع.
3. مجلدات المشروع، عبر الخاصية exclude: تستخدم لاستدعاء جميع الملفّات ذات الصيغة ts أو tsx(ملفّات الواجهة الخاصة بreact)، بداخل مجلد ما، وهي بديلة عن files.
ويوجد خاصية أخرى غير مهمِّة بالمرة compileOnSave؛ فائدتها تتلخص في جعل المحرِّر البرمجي -إن كان يدعم ذلك، يجمِّع الشيفرة فور الحفظ.
كمثال سنكتب ملف مشروع لتجميع ملفّات TypeScript بداخل المجلد a، وإنتاج أخرى بداخل المجلد b، مع إصدار المواصفة ES5، سيكون ملف tsconfig.json كالتالي:

```json
	{
		"compilerOptions": {
			"target": "ES5",
			"outDir": "b",
			 "sourceMap": true
		},
		"exclude": [
			"./a"
		]
	}
```
يمكن تجمِّيع المشروع السابق عبر اِستدعاء المجمِّع في مجلد المشروع بدون أي إعدادات.
بعد هذا الدَّرس من المفترض أن يكون لديك علم بماهية لغة TypeScript واختلافها عن JavaScript، وطريقة إعداد مشروع بلغة TypeScript. في دروس قادمة سنبدأ بشرح خواص اللَّغة والتجريب العملي -بإذن الله-. فقط عليك بمُتابعة أكادميِّة حسوب باستمرار.
##مصادر
[ECMAScript netscape.com](http://web.archive.org/web/19981203070212/http://cgi.netscape.com/newsref/pr/newsrelease289.html)
[ecmascript wiki](http://wiki.ecmascript.org/doku.php)
[Angular 2: Built on TypeScript msdn](https://blogs.msdn.microsoft.com/typescript/2015/03/05/angular-2-built-on-typescript/)
[why TypeScript](https://basarat.gitbooks.io/typescript/content/docs/why-typescript.html).
