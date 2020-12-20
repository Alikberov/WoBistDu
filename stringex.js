const	iconv		= require("iconv-lite");

Object.defineProperty(
	String.prototype, "win1251__", {
		get: function () {
			console.log(`--- win1251 ---`);
			console.log(iconv.decode(Buffer.from(this, "binary"), "utf8").toString());
			console.log(iconv.decode(Buffer.from(this, "ascii"), "utf8").toString());
			console.log(iconv.decode(Buffer.from(this, "binary"), "win1251").toString());
			console.log(iconv.decode(Buffer.from(this, "ascii"), "win1251").toString());
			console.log(`--- win1251 ---`);
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);

Object.defineProperty(
	String.prototype, "shifted", {
		get: function () {
			return	this
				.replace(
					/\(#([-0-9+(*)/%]+)\)/gm
					,function(match, expression) {
						try {
							return eval(expression);
						} catch(e) {
							console.log(`// String.shifted:: Bad expression (${expression})`);
						}
						return	0;
					}
				)
				//	"3(.14159)".shifted == "3₁₄₁₅₉"
				//	"23(^59)30".shifted == "23⁵⁹30"
				//	"31(|12)18".shifted == "31Ⅻ18"
				//	"2(@10)127".shifted == "2⑩127"
				.replace(
					/\(([|.^@])(\d+)\)/gm
					,function(match, prefix, numbers) {
						var	pattern = {
								"."	:"₀₁₂₃₄₅₆₇₈₉",
								"^"	:"⁰¹²³⁴⁵⁶⁷⁸⁹",
								"|"	:"ØⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ",
								"@"	:"Ⓞ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"
							}[prefix].split("");
						return	numbers
							.replace(
								"|" == prefix
									? (/10|11|12|\d/g)
									:
								"@" == prefix
									? (/1\d|20|\d/g)
									: (/\d/g)
								,function(n) {
									return	pattern[n];
								}
							)
						;
					}
				)
				//	"+-(c)`(r)-:(s)..".shifted == "±©×®÷§…"
				.replace(
					/(\+-|-:|\([crs]\)|\.{2,}|[&<`>]|,(?:\s*))/gm
					,function(match, symbol) {
						console.log(`${match}::${symbol}`);
						return {
								"+-"	:"±",
								"-:"	:"÷",
								"(c)"	:"©",
								"(r)"	:"®",
								"(s)"	:"§",
								"&"	:"№",
								"<"	:"«",
								">"	:"»",
								"`"	:"×",
								","	:", ",
								".."	:"…"
							}[symbol.replace(/\.{2,}/, "..")];
					}
				)
				//	"(*bold)".shifted == "<b>bold</b>"
				//	"(!em)".shifted == "<em>em</em>"
				.replace(
					/\(([=*_\/!~])(.*)\)/gm
					,function(match, prefix, text) {
						var	tag = {
								"*"	:"b",
								"/"	:"i",
								"="	:"s",
								"_"	:"u",
								"~"	:"blink",
								"!"	:"em"
							}[prefix];
						return	`<${tag}>${text}</${tag}>`;
					}
				)
				.replace(
					/(http(s*):\/\/[-a-z.A-Z_0-9%/]+)/g, "<a href='$1'>$1</a>"
				)
			;
		}
	}
);
Object.defineProperty(
	String.prototype, "shiftedHTML", {
		get: function () {
			return	this
				.replace(
					/\(#([-0-9+(*)/%]+)\)/gm
					,function(match, expression) {
						try {
							return eval(expression);
						} catch(e) {
							console.log(`// String.shifted:: Bad expression (${expression})`);
						}
						return	0;
					}
				)
				//	"3(.14159)".shifted == "3₁₄₁₅₉"
				//	"23(^59)30".shifted == "23⁵⁹30"
				//	"31(|12)18".shifted == "31Ⅻ18"
				//	"2(@10)127".shifted == "2⑩127"
				.replace(
					/\(([|.^@])(\d+)\)/gm
					,function(match, prefix, numbers) {
						var	pattern = {
								"."	:"₀₁₂₃₄₅₆₇₈₉",
								"^"	:"⁰¹²³⁴⁵⁶⁷⁸⁹",
								"|"	:"ØⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ",
								"@"	:"Ⓞ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"
							}[prefix].split("");
						return	numbers
							.replace(
								"|" == prefix
									? (/10|11|12|\d/g)
									:
								"@" == prefix
									? (/1\d|20|\d/g)
									: (/\d/g)
								,function(n) {
									return	pattern[n];
								}
							)
						;
					}
				)
			;
		}
	}
);

Object.defineProperty(
	String.prototype, "win1251", {
		get: function () {
			var b=Buffer.from(this, "ascii");
			//console.log(util.inspect(b, false, null, true /* enable colors */));
			return	iconv.decode(Buffer.from(this, "binary"), "utf8").toString();
		}
	}
);

module.exports = {
	iconv	:iconv,
	String	:String
};
