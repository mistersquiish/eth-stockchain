const hero = document.querySelector('.hero');
const headline = document.querySelector('.headline');
const containers = document.querySelector('.container-fluid');

const t1 = new TimelineMax();

t1.fromTo(hero, 1, {height: "0%"}, {height: "80%"})
t1.fromTo(headline, .5, {opacity: .5}, {opacity: 1})
.fromTo(hero, 1.2, {width: '100%'}, {width: '97%', ease: Power2.easeInOut})
.fromTo(containers, 1, {opacity: 0}, {opacity: 1});