// 静态方法
var sitedata = {
	data: window.arrCity,
	p: document.querySelector('.province'),
	c: document.querySelector('.city'),

	pSel: '',
	cSel: '',

	pAdd: function(selVal){
		sitedata.data.forEach(function(pArr, index){
			var eOption = document.createElement('option');
			eOption.text = pArr.name;
			pArr.name == selVal ? eOption.selected = true : 0;
			sitedata.p.add(eOption, null);
		});
	},
	cAdd: function(selVal){
		sitedata.c.innerHTML = '';
		sitedata.data[sitedata.p.selectedIndex].sub ? 
		sitedata.data[sitedata.p.selectedIndex].sub.forEach(function(cArr, index){
			var eOption = document.createElement('option');
			eOption.text = cArr.name;
			cArr.name == selVal ? eOption.selected = true : 0;
			sitedata.c.add(eOption, null);
		}) : (sitedata.c.disabled = true);
	},
	bind: function(){
		sitedata.p.onchange = function(){
			sitedata.cAdd();
			sitedata.pSel = sitedata.p.options[sitedata.p.selectedIndex].text;
			document.querySelector('[name="address"]').value = sitedata.pSel;
		};
		sitedata.c.onchange = function(){
			sitedata.cSel = sitedata.c.options[sitedata.c.selectedIndex].text;
			document.querySelector('[name="address"]').value = sitedata.pSel + '-' + sitedata.cSel;
		};
	},
	init: function(pSel, cSel){
		sitedata.pSel = pSel;
		sitedata.cSel = cSel;
		sitedata.pAdd(pSel);
		sitedata.cAdd(cSel);
		sitedata.bind();
	}
};