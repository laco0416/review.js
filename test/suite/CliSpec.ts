///<reference path='../../typings/mocha/mocha.d.ts' />
///<reference path='../../typings/assert/assert.d.ts' />

///<reference path='../../typings/node/node.d.ts' />

///<reference path='../../typings/es6-promise/es6-promise.d.ts' />

"use strict";

describe("コマンドラインツールの動作", ()=> {
	"use strict";

	if (!ReVIEW.isNodeJS()) {
		return;
	}

	function exec(command:string, stdin?:string):Promise<string>;

	function exec(command:string, options?:any, stdin?:string):Promise<string>;

	function exec(command:string, options?:any, stdin?:string):Promise<string> {
		if (typeof options === "string") {
			stdin = options;
			options = void 0;
		}

		var exec = require("child_process").exec;
		return new Promise<string>((resolve, reject)=> {
			var child = exec(command, options, (error:string, stdout:string, stderr:string) => {
				if (error) {
					reject(error);
					return;
				}
				resolve(stdout);
			});
			if (stdin) {
				child.stdin.write(stdin);
				child.stdin.end();
			}
		});
	}

	describe("reviewjs build の動作", ()=> {
		it("reviewjs build でファイル群のコンパイルができること", ()=> {
			var baseDir = "test/fixture/reviewjs-book/";
			var fs = require("fs");
			if (fs.existsSync(baseDir + "ch01.html")) {
				fs.unlinkSync(baseDir + "ch01.html");
			}
			if (fs.existsSync(baseDir + "ch02.html")) {
				fs.unlinkSync(baseDir + "ch02.html");
			}
			assert(!fs.existsSync(baseDir + "ch01.html"));
			assert(!fs.existsSync(baseDir + "ch02.html"));
			return exec("../../../bin/reviewjs build", {cwd: baseDir})
				.then(()=> {
					assert(fs.existsSync(baseDir + "ch01.html"));
					assert(fs.existsSync(baseDir + "ch02.html"));
				});
		});

		it("reviewjs build でRuby用設定ファイルを元にファイル群のコンパイルができること", ()=> {
			var baseDir = "test/fixture/ruby-book/";
			var fs = require("fs");
			if (fs.existsSync(baseDir + "ch01.html")) {
				fs.unlinkSync(baseDir + "ch01.html");
			}
			if (fs.existsSync(baseDir + "ch02.html")) {
				fs.unlinkSync(baseDir + "ch02.html");
			}
			assert(!fs.existsSync(baseDir + "ch01.html"));
			assert(!fs.existsSync(baseDir + "ch02.html"));
			return exec("../../../bin/reviewjs build", {cwd: baseDir})
				.then(()=> {
					assert(fs.existsSync(baseDir + "ch01.html"));
					assert(fs.existsSync(baseDir + "ch02.html"));
				});
		});
	});

	describe("reviewjs compile の動作", ()=> {
		it("reviewjs compile fileName でコンパイルができること", ()=> {
			return exec("./bin/reviewjs compile test/fixture/valid/block.re")
				.then(stdout=> {
					assert(stdout.indexOf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>") === 0);
				});
		});

		it("reviewjs compile --target text fileName でコンパイルができること", ()=> {
			return exec("./bin/reviewjs compile --target text test/fixture/valid/block.re")
				.then(stdout=> {
					assert(stdout.indexOf("■H1■第1章") === 0);
				});
		});

		it("reviewjs compile --target text < ??? でコンパイルができること", ()=> {
			return exec("./bin/reviewjs compile --target text", "= Hello\nworld!")
				.then(stdout=> {
					assert(stdout === "■H1■第1章　Hello\n\nworld!\n\n");
				});
		});
	});
});
