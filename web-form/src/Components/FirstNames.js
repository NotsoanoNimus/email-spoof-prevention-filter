export const wellKnownNames = [
	{
		// John, Johnny, ...
		regex : /^joh?n(ath(a|o)n|ny|nie)?$/i,
		mutation : "J(\\.|oh?n(athan|athon|ny|nie)?)?"
	},
	{
		// Daniel, Dan, Danny, ...
		regex : /^dan(n(y|ie)|iel)?$/i,
		mutation : "D(\\.|an(n(y|ie)|iel)?)?"
	},
	{
		// Zachary, Zack, ...
		regex : /^zac([kh]([ae]ry)?)?$/i,
		mutation : "Z(\\.|ac([kh]((e|a)ry)?)?)?"
	},
	{
		// Bob, Robert, Robbie, ...
		regex : /^(bob(b?(y|ie))?|(rob(ert|b?(y|ie))?))$/i,
		mutation : "(((B|R)\\.?)|Bob(b?(y|ie))?|Rob(ert|b?(y|ie))?)"
	},
	{
		// Tom, Thomas, Tommy, ...
		regex : /^th?om(as|m?(y|ie))?$/i,
		mutation : "T(\\.|h?om(as|m?(y|ie))?)?"
	},
	{
		// Bill, William, Willie, ...
		regex : /^([bw]ill(iam|y|ie)?)$/i,
		mutation : "(B|W)(\\.|ill(iam|y|ie)?)?"
	},
	{
		// Allie, Allsion, ...
		regex : /^al(ice|lison|l?ie)$/i,
		mutation: "A(\\.|l(ice|lison|l?ie))?"
	},
	{
		// Elizabeth, Lisa, Lizzie, ...
		regex : /^e?li(za(beth)?|sa|zz?(y|ie))$/i,
		mutation : "E?li(za(beth)?|sa|zz?(y|ie)?)"
	},
	{
		// Steve, Stephen, ...
		regex : /^ste(v|ph)en?$/i,
		mutation : "S(\\.|te(v|ph)en?)?"
	},
	{
		// Sean, Shawn, ...
		regex : /^s(hawn|ean)$/i,
		mutation : "S(\\.|hawn|ean)?"
	},
	{
		// David, Dave.
		regex : /^dav(e|id)$/i,
		mutation : "D(\\.|av(e|id))?"
	},
	{
		// Greg, Gregory.
		regex : /^greg(ory)?$/i,
		mutation : "G(\\.|reg(ory)?)?"
	},
	{
		// Donald, Donnie, Don, ...
		regex : /^don(ald|n?(y|ie))?$/i,
		mutation : "D(\\.|on(ald|n?(y|ie))?)?"
	},
	{
		// Christopher, Kris, ...
		regex : /^(c|k)h?ris(topher)?$/i,
		mutation : "[CK](\\.|h?ris(topher)?)?"
	},
	{
		// James, Jimmie, Jamie, ...
		regex : /^j(am(es|e?y|ie)|im(m(y|ie))?)$/i,
		mutation : "J(\\.|am(es|e?y|ie)|im(m(y|ie))?)?"
	},
	{
		// Charles, Chuck, Chuckie, ...
		regex : /^ch(arl(ie|ee|es)|uck(y|ie)?)$/i,
		mutation : "C(\\.|h(arl(ie|ee|es)|uck(y|ie)?))?"
	},
	{
		// Jen, Jennifer, Jenny, ...
		regex : /^jenn?(y|ifer|ie)?$/i,
		mutation : "J(\\.|enn?(y|ie|ifer)?)?"
	},
	{
		// Sue, Susie, Susan, ...
		regex : /^su(e|sie|san)$/i,
		mutation : "S(\\.|u(e|sie|san))?",
	},
	{
		// Deb, Deborah, Debbie, ...
		regex : /^deb(b(y|ie)?|ra|orah?)?$/i,
		mutation : "D(\\.|eb(b(y|ie)?|ra|orah?)?)?"
	},
	{
		// Ron, Ronald, Ronnie, ...
		regex : /^ron(ald|n?(y|ie))?$/i,
		mutation : "R(\\.|on(ald|n?(y|ie))?)?"
	},
	{
		// Mary, Miriam, Marie, ...
		regex : /^(miriam|mar(ie|y|iam))$/i,
		mutation : "M(\\.|(i|a)r(iam|y|ie))?"
	},
	{
		// Mikey, Michael, ...
		regex : /^mi(cha?el|key?)$/i,
		mutation : "M(\\.|i(key?|cha?el))?"
	},
	{
		// Matt, Mathew, Matthew, ...
		regex : /^mat(t?hew)?$/i,
		mutation : "M(\\.|at(t?hew)?)?"
	},
	{
		// Ken, Kenny, Kenneth, ...
		regex : /^ken(n?(y|ie|eth))?$/i,
		mutation : "K(\\.|en(n?(y|ie|eth))?)?"
	},
	{
		// Richard, Rickie, Ricardo, ...
		regex : /^ric[hk]?(ardo?|ie)?$/i,
		mutation : "R(\\.|ic[hk]?(ardo?|ie)?)?"
	},
	{
		// Muhammad, Mo, Moe, Mohammad, ...
		regex : /^m(oe?|(u|o)hamm?(a|e|u|i)(d|t))$/i,
		mutation : "M(\\.|oe?|(u|o)hamm?(a|u|e|i)(d|t))?"
	},
	{
		// Joe, Joseph, Jose, ...
		regex : /^jo(s?e(y|ph)?)?$/i,
		mutation : "J(\\.|o(s?e(y|ph)?)?)?"
	},
	{
		// This one might be dangerous as a unisex name. If "Samuel Smith" is intended to be
        //  blocked, this might also block "Samantha Smith". Leaving for now.
		// Sam, Samantha, Sammy, Samuel, ...
		regex : /^sam(uel|m?(ie|y)|antha)?$/i,
		mutation : "S(\\.|am(uel|m?(ie|y)|antha)?)?"
	},
	{
		// Jess, Jessica, Jessie, ...
		regex : /^jess((e|i)ca|y|ie)?$/i,
		mutation : "J(\\.|ess((e|i)ca|y|ie)?)?"
	},
	{
		// Tony, Anthony, Tonie, ...
		regex : /^(an)?th?o(ine|n(ie|y))$/i,
		mutation : "(An|T)(\\.|h?o(ine|n(ie|y)))?"
	},
	{
		// Andy, Drew, Andrew, ...
		regex : /^(drew|and(y|ie|rew))$/i,
		mutation : "A(\\.|nd(y|ie|rew))?"
	},
	{
		// Bree, Breanna, Brie, ...
		regex : /^br(i|e)e?(ann?a)?$/i,
		mutation : "B(\\.|r(i|e)e?(ann?a)?)?"
	}
];