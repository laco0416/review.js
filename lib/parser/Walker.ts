///<reference path='../model/CompilerModel.ts' />
///<reference path='Parser.ts' />

module ReVIEW {
	"use strict";

	export module Parse {
		// Parser.ts との読み込み順序の関係で undefined を参照するエラーを避ける
		void 0;
	}

	import SyntaxTree = ReVIEW.Parse.SyntaxTree;
	import BlockElementSyntaxTree = ReVIEW.Parse.BlockElementSyntaxTree;
	import InlineElementSyntaxTree = ReVIEW.Parse.InlineElementSyntaxTree;
	import ArgumentSyntaxTree = ReVIEW.Parse.ArgumentSyntaxTree;
	import ChapterSyntaxTree = ReVIEW.Parse.ChapterSyntaxTree;
	import HeadlineSyntaxTree = ReVIEW.Parse.HeadlineSyntaxTree;
	import UlistElementSyntaxTree = ReVIEW.Parse.UlistElementSyntaxTree;
	import OlistElementSyntaxTree = ReVIEW.Parse.OlistElementSyntaxTree;
	import DlistElementSyntaxTree = ReVIEW.Parse.DlistElementSyntaxTree;
	import ColumnSyntaxTree = ReVIEW.Parse.ColumnSyntaxTree;
	import ColumnHeadlineSyntaxTree = ReVIEW.Parse.ColumnHeadlineSyntaxTree;
	import NodeSyntaxTree = ReVIEW.Parse.NodeSyntaxTree;
	import TextNodeSyntaxTree = ReVIEW.Parse.TextNodeSyntaxTree;

	/**
	 * 指定された構文木を歩きまわる。
	 * 次にどちらへ歩くかは渡した関数によって決まる。
	 * null が返ってくると歩くのを中断する。
	 * @param ast
	 * @param actor
	 */
	export function walk(ast:SyntaxTree, actor:(ast:SyntaxTree)=>SyntaxTree) {
		var next = actor(ast);
		if (next) {
			walk(next, actor);
		}
	}

	/**
	 * 指定された構文木の全てのノード・リーフを同期的に探索する。
	 * 親子であれば親のほうが先に探索され、兄弟であれば兄のほうが先に探索される。
	 * つまり、葉に着目すると文章に登場する順番に探索される。
	 * @param ast
	 * @param v
	 */
	export function visit(ast:SyntaxTree, v:ITreeVisitor):void {
		_visit(()=> new SyncTaskPool<void>(), ast, v);
	}

	/**
	 * 指定された構文木の全てのノード・リーフを非同期に探索する。
	 * 親子であれば親のほうが先に探索され、兄弟であれば兄のほうが先に探索される。
	 * つまり、葉に着目すると文章に登場する順番に探索される。
	 * @param ast
	 * @param v
	 */
	export function visitAsync(ast:SyntaxTree, v:ITreeVisitor):Promise<void> {
		return Promise.resolve(_visit(()=> new AsyncTaskPool<void>(), ast, v));
	}

	function _visit(poolGenerator:()=>ITaskPool<void>, ast:SyntaxTree, v:ITreeVisitor):any {
		var newV:ITreeVisitor = {
			visitDefaultPre: v.visitDefaultPre,
			visitDefaultPost: v.visitDefaultPost || (()=> {
			}),
			visitBlockElementPre: v.visitBlockElementPre || v.visitNodePre || v.visitDefaultPre,
			visitBlockElementPost: v.visitBlockElementPost || v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitInlineElementPre: v.visitInlineElementPre || v.visitNodePre || v.visitDefaultPre,
			visitInlineElementPost: v.visitInlineElementPost || v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitNodePre: v.visitNodePre || v.visitDefaultPre,
			visitNodePost: v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitArgumentPre: v.visitArgumentPre || v.visitDefaultPre,
			visitArgumentPost: v.visitArgumentPost || v.visitDefaultPost || (()=> {
			}),
			visitChapterPre: v.visitChapterPre || v.visitNodePre || v.visitDefaultPre,
			visitChapterPost: v.visitChapterPost || v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitParagraphPre: v.visitParagraphPre || v.visitNodePre || v.visitDefaultPre,
			visitParagraphPost: v.visitParagraphPost || v.visitNodePost || (()=> {
			}),
			visitHeadlinePre: v.visitHeadlinePre || v.visitDefaultPre,
			visitHeadlinePost: v.visitHeadlinePost || v.visitDefaultPost || (()=> {
			}),
			visitUlistPre: v.visitUlistPre || v.visitNodePre || v.visitDefaultPre,
			visitUlistPost: v.visitUlistPost || v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitOlistPre: v.visitOlistPre || v.visitDefaultPre,
			visitOlistPost: v.visitOlistPost || v.visitDefaultPost || (()=> {
			}),
			visitDlistPre: v.visitDlistPre || v.visitDefaultPre,
			visitDlistPost: v.visitDlistPost || v.visitDefaultPost || (()=> {
			}),
			visitColumnPre: v.visitColumnPre || v.visitNodePre || v.visitDefaultPre,
			visitColumnPost: v.visitColumnPost || v.visitNodePost || v.visitDefaultPost || (()=> {
			}),
			visitColumnHeadlinePre: v.visitColumnHeadlinePre || v.visitDefaultPre,
			visitColumnHeadlinePost: v.visitColumnHeadlinePost || v.visitDefaultPost || (()=> {
			}),
			visitTextPre: v.visitTextPre || v.visitDefaultPre,
			visitTextPost: v.visitTextPost || v.visitDefaultPost || (()=> {
			})
		};
		newV.visitDefaultPre = newV.visitDefaultPre.bind(v);
		newV.visitDefaultPost = newV.visitDefaultPost.bind(v);
		newV.visitBlockElementPre = newV.visitBlockElementPre.bind(v);
		newV.visitBlockElementPost = newV.visitBlockElementPost.bind(v);
		newV.visitInlineElementPre = newV.visitInlineElementPre.bind(v);
		newV.visitInlineElementPost = newV.visitInlineElementPost.bind(v);
		newV.visitNodePre = newV.visitNodePre.bind(v);
		newV.visitNodePost = newV.visitNodePost.bind(v);
		newV.visitArgumentPre = newV.visitArgumentPre.bind(v);
		newV.visitArgumentPost = newV.visitArgumentPost.bind(v);
		newV.visitChapterPre = newV.visitChapterPre.bind(v);
		newV.visitChapterPost = newV.visitChapterPost.bind(v);
		newV.visitHeadlinePre = newV.visitHeadlinePre.bind(v);
		newV.visitHeadlinePost = newV.visitHeadlinePost.bind(v);
		newV.visitUlistPre = newV.visitUlistPre.bind(v);
		newV.visitUlistPost = newV.visitUlistPost.bind(v);
		newV.visitOlistPre = newV.visitOlistPre.bind(v);
		newV.visitOlistPost = newV.visitOlistPost.bind(v);
		newV.visitDlistPre = newV.visitDlistPre.bind(v);
		newV.visitDlistPost = newV.visitDlistPost.bind(v);
		newV.visitColumnPre = newV.visitColumnPre.bind(v);
		newV.visitColumnPost = newV.visitColumnPost.bind(v);
		newV.visitColumnHeadlinePre = newV.visitColumnHeadlinePre.bind(v);
		newV.visitColumnHeadlinePost = newV.visitColumnHeadlinePost.bind(v);
		newV.visitTextPre = newV.visitTextPre.bind(v);
		newV.visitTextPost = newV.visitTextPost.bind(v);

		return _visitSub(poolGenerator, null, ast, newV);
	}

	function _visitSub(poolGenerator:()=>ITaskPool<void>, parent:SyntaxTree, ast:SyntaxTree, v:ITreeVisitor):any {
		if (ast instanceof ReVIEW.Parse.BlockElementSyntaxTree) {
			return (()=> {
				var block = ast.toBlockElement();
				var pool = poolGenerator();
				var ret = v.visitBlockElementPre(block, parent);
				pool.handle(ret, {
					next: ()=> {
						block.args.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
						block.childNodes.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitBlockElementPost(block, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.InlineElementSyntaxTree) {
			return (()=> {
				var inline = ast.toInlineElement();
				var pool = poolGenerator();
				var ret = v.visitInlineElementPre(inline, parent);
				pool.handle(ret, {
					next: ()=> {
						inline.childNodes.forEach((next)=> {
							pool.add(()=>_visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitInlineElementPost(inline, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.ArgumentSyntaxTree) {
			return (()=> {
				var arg = ast.toArgument();
				var pool = poolGenerator();
				var ret = v.visitArgumentPre(arg, parent);
				pool.handle(ret, {
					next: ()=> {
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitArgumentPost(arg, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.ChapterSyntaxTree) {
			return (()=> {
				var chap = ast.toChapter();
				var pool = poolGenerator();
				var ret = v.visitChapterPre(chap, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=> _visitSub(poolGenerator, ast, chap.headline, v));
						if (chap.text) {
							chap.text.forEach((next)=> {
								pool.add(()=> _visitSub(poolGenerator, ast, next, v));
							});
						}
						chap.childNodes.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitChapterPost(chap, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.HeadlineSyntaxTree) {
			return (()=> {
				var head = ast.toHeadline();
				var pool = poolGenerator();
				var ret = v.visitHeadlinePre(head, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=>_visitSub(poolGenerator, ast, head.label, v));
						pool.add(()=>_visitSub(poolGenerator, ast, head.caption, v));
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitHeadlinePost(head, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.ColumnSyntaxTree) {
			return (()=> {
				var column = ast.toColumn();
				var pool = poolGenerator();
				var ret = v.visitColumnPre(column, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=> _visitSub(poolGenerator, ast, column.headline, v));
						if (column.text) {
							column.text.forEach((next)=> {
								pool.add(()=> _visitSub(poolGenerator, ast, next, v));
							});
						}
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitColumnPost(column, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.ColumnHeadlineSyntaxTree) {
			return (()=> {
				var columnHead = ast.toColumnHeadline();
				var pool = poolGenerator();
				var ret = v.visitColumnHeadlinePre(columnHead, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=>_visitSub(poolGenerator, ast, columnHead.caption, v));
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitColumnHeadlinePost(columnHead, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.UlistElementSyntaxTree) {
			return (()=> {
				var ul = ast.toUlist();
				var pool = poolGenerator();
				var ret = v.visitUlistPre(ul, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=> _visitSub(poolGenerator, ast, ul.text, v));
						ul.childNodes.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitUlistPost(ul, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.OlistElementSyntaxTree) {
			return (()=> {
				var ol = ast.toOlist();
				var pool = poolGenerator();
				var ret = v.visitOlistPre(ol, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=>_visitSub(poolGenerator, ast, ol.text, v));
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitOlistPost(ol, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.DlistElementSyntaxTree) {
			return (()=> {
				var dl = ast.toDlist();
				var pool = poolGenerator();
				var ret = v.visitDlistPre(dl, parent);
				pool.handle(ret, {
					next: ()=> {
						pool.add(()=> _visitSub(poolGenerator, ast, dl.text, v));
						pool.add(()=> _visitSub(poolGenerator, ast, dl.content, v));
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitDlistPost(dl, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.NodeSyntaxTree && (ast.ruleName === ReVIEW.Parse.RuleName.Paragraph || ast.ruleName === ReVIEW.Parse.RuleName.BlockElementParagraph)) {
			return (()=> {
				var node = ast.toNode();
				var pool = poolGenerator();
				var ret = v.visitParagraphPre(node, parent);
				pool.handle(ret, {
					next: ()=> {
						node.childNodes.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitParagraphPost(node, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.NodeSyntaxTree) {
			return (()=> {
				var node = ast.toNode();
				var pool = poolGenerator();
				var ret = v.visitNodePre(node, parent);
				pool.handle(ret, {
					next: ()=> {
						node.childNodes.forEach((next)=> {
							pool.add(()=> _visitSub(poolGenerator, ast, next, v));
						});
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitNodePost(node, parent));
				return pool.consume();
			})();
		} else if (ast instanceof ReVIEW.Parse.TextNodeSyntaxTree) {
			return (()=> {
				var text = ast.toTextNode();
				var pool = poolGenerator();
				var ret = v.visitTextPre(text, parent);
				pool.handle(ret, {
					next: ()=> {
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitTextPost(text, parent));
				return pool.consume();
			})();
		} else if (ast) {
			return (()=> {
				var pool = poolGenerator();
				var ret = v.visitDefaultPre(parent, ast);
				pool.handle(ret, {
					next: ()=> {
					},
					func: ()=> {
						ret(v);
					}
				});
				pool.add(()=> v.visitDefaultPost(parent, ast));
				return pool.consume();
			})();
		} else {
			return (()=> {
				var pool = poolGenerator();
				return pool.consume();
			})();
		}
	}

	/**
	 * 構文木を渡り歩くためのVisitor。
	 * 実装されなかったメソッドは、visitDefault または NodeSyntaxTree を継承している場合 visitNode にフォールバックする。
	 * 各メソッドの返り値としてanyを返す。
	 * undefined, true を返した時、子要素の探索は継続される。
	 * false を返した時、子要素の探索は行われない。
	 * Function を返した時、子要素の探索を行う代わりにその関数が実行される。Functionには引数として実行中のTreeVisitorが渡される。
	 */
	export interface ITreeVisitor {
		visitDefaultPre(node:SyntaxTree, parent:SyntaxTree):any;
		visitDefaultPost?(node:SyntaxTree, parent:SyntaxTree):void;
		visitNodePre?(node:NodeSyntaxTree, parent:SyntaxTree):any;
		visitNodePost?(node:NodeSyntaxTree, parent:SyntaxTree):void;
		visitBlockElementPre?(node:BlockElementSyntaxTree, parent:SyntaxTree):any;
		visitBlockElementPost?(node:BlockElementSyntaxTree, parent:SyntaxTree):void;
		visitInlineElementPre?(node:InlineElementSyntaxTree, parent:SyntaxTree):any;
		visitInlineElementPost?(node:InlineElementSyntaxTree, parent:SyntaxTree):void;
		visitArgumentPre?(node:ArgumentSyntaxTree, parent:SyntaxTree):any;
		visitArgumentPost?(node:ArgumentSyntaxTree, parent:SyntaxTree):void;
		visitChapterPre?(node:ChapterSyntaxTree, parent:SyntaxTree):any;
		visitChapterPost?(node:ChapterSyntaxTree, parent:SyntaxTree):void;
		visitParagraphPre?(node:NodeSyntaxTree, parent:SyntaxTree):any;
		visitParagraphPost?(node:NodeSyntaxTree, parent:SyntaxTree):void;
		visitHeadlinePre?(node:HeadlineSyntaxTree, parent:SyntaxTree):any;
		visitHeadlinePost?(node:HeadlineSyntaxTree, parent:SyntaxTree):void;
		visitUlistPre?(node:UlistElementSyntaxTree, parent:SyntaxTree):any;
		visitUlistPost?(node:UlistElementSyntaxTree, parent:SyntaxTree):void;
		visitOlistPre?(node:OlistElementSyntaxTree, parent:SyntaxTree):any;
		visitOlistPost?(node:OlistElementSyntaxTree, parent:SyntaxTree):void;
		visitDlistPre?(node:DlistElementSyntaxTree, parent:SyntaxTree):any;
		visitDlistPost?(node:DlistElementSyntaxTree, parent:SyntaxTree):void;
		visitColumnPre?(node:ColumnSyntaxTree, parent:SyntaxTree):any;
		visitColumnPost?(node:ColumnSyntaxTree, parent:SyntaxTree):void;
		visitColumnHeadlinePre?(node:ColumnHeadlineSyntaxTree, parent:SyntaxTree):any;
		visitColumnHeadlinePost?(node:ColumnHeadlineSyntaxTree, parent:SyntaxTree):void;
		visitTextPre?(node:TextNodeSyntaxTree, parent:SyntaxTree):any;
		visitTextPost?(node:TextNodeSyntaxTree, parent:SyntaxTree):void;
	}

	/**
	 * 同期化処理と非同期化処理の記述を一本化するためのヘルパインタフェース。
	 * 構造が汚いのでexportしないこと。
	 */
	interface ITaskPool<T> {
		add(value:()=>T):void;
		handle(value:any, statements:{next: ()=>void;func:()=>void;}):void;
		consume():any; // T | Promise<T[]>
	}

	/**
	 * 同期化処理をそのまま同期処理として扱うためのヘルパクラス。
	 */
	class SyncTaskPool<T> implements ITaskPool<T> {
		tasks:{(): T;}[] = [];

		add(value:()=>T):void {
			this.tasks.push(value);
		}

		handle(value:any, statements:{next: ()=>void;func:()=>void;}):void {
			if (typeof value === "undefined" || (typeof value === "boolean" && value)) {
				statements.next();
			} else if (typeof value === "function") {
				statements.func();
			}
		}

		consume():T[] {
			return this.tasks.map(task => task());
		}
	}

	/**
	 * 同期化処理を非同期化するためのヘルパクラス。
	 * array.forEach(value => process(value)); を以下のように書き換えて使う。
	 * var pool = new AsyncTaskPool<any>();
	 * array.forEach(value => pool.add(()=> process(value));
	 * pool.consume().then(()=> ...);
	 */
	class AsyncTaskPool<T> implements ITaskPool<T> {
		tasks:{():Promise<T>;}[] = [];

		add(value:()=>T):void;

		add(task:()=>Promise<T>):void;

		add(value:()=>any) {
			this.tasks.push(()=> Promise.resolve(value()));
		}

		handle(value:any, statements:{next: ()=>void;func:()=>void;}):void {
			if (typeof value === "undefined" || (typeof value === "boolean" && value)) {
				statements.next();
			} else if (value && typeof value.then === "function") {
				this.tasks.push(()=> Promise.resolve(value));
			} else if (typeof value === "function") {
				statements.func();
			}
		}

		consume():Promise<T[]> {
			var promise = new Promise<T[]>((resolve, reject)=> {
				var result:T[] = [];
				var next = ()=> {
					var func = this.tasks.shift();
					if (!func) {
						resolve(result);
						return;
					}
					func().then(value => {
						result.push(value);
						next();
					});
				};
				next();
			});
			return promise;
		}
	}
}
