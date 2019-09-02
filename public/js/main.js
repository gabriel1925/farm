(function(d){
var tabs = Array.prototype.slice.apply(d.querySelectorAll('.tabs__item'));
var panels = Array.prototype.slice.apply(d.querySelectorAll('.panels__item'));
//console.log(tabs);
//console.log(panels);
d.getElementById('tabs').addEventListener('click', function (e) {
	//console.dir(e.target);
	/*if (e.target.tagName == 'LI') {
	alert('click');
}*/
	if (e.target.classList.contains('tabs__item')) {

		if (e.target.classList.contains('todos')) {
			var i = tabs.indexOf(e.target);
			tabs.map(function (tab) {
				return tab.classList.remove('active');
			});
			tabs[i].classList.add('active');
			panels.map(function (panel) {
				return panel.classList.add('active');
			});
		} else {
			var _i = tabs.indexOf(e.target);
			tabs.map(function (tab) {
				return tab.classList.remove('active');
			});
			tabs[_i].classList.add('active');
			panels.map(function (panel) {
				return panel.classList.remove('active');
			});
			panels[_i].classList.add('active');
		}
	}

});

})(document);

