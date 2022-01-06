;(function(window){
    const document = window.document;
    const DefaultConfig = {
        container: {
            type: String,
            required: false,
            defaultVal: '#container',
            msg: '星星的容器，填入选择器',
        },
        starColor: {
            type: String,
            required: false,
            defaultVal: '#ffe4c4',
            msg: '星星的颜色，十六进制色值',
        },
        angleColor: {
            type: String,
            required: false,
            defaultVal: '#ffffff',
            msg: '星星四角遮罩的颜色，十六进制色值',
        },
        starPos: {
            type: Array,
            required: false,
            defaultVal: [0,0],
            msg: '星星的位置，数组，分别存left和top位置，可以是数字或百分比字符串',
        },
        starSize: {
            type: Array,
            required: false,
            defaultVal: [50,50],//一般宽高相等
            msg: '星星的尺寸，数组，分别存width和height，可以是数字或百分比字符串',
        },
    };
    // 设置DOM模板
    function getStarTemplate(config){
        const Template = [
                `<div class="star" style="width: 100%; height: 100%">`
            ,       `<div class="angle angle-l-t"></div>`
            ,       `<div class="angle angle-l-b"></div>`
            ,       `<div class="angle angle-r-t"></div>`
            ,       `<div class="angle angle-r-b"></div>`
            ,   `</div>`
        ]
        let star = document.createElement('div');
        let container = document.querySelector(config.container);
        if(!container){
            throw new Error('未找到容器！');
        }
        star.innerHTML = Template.join('');
        star.style.display = 'none';
        star.style.position = 'absolute';
        star.style.overflow = 'hidden';
        container.appendChild(star);
        return star;
    }
    function renderStar(star){
        star.setStarSize(star.config.starSize)
        star.setStarPos(star.config.starPos);
        star.setAnglePos();
        star.setStarBgc(star.config.starColor);
        star.setAngleBgc(star.config.angleColor);
    }
    function Star(config){
        this.starId = '';
        this.star = null;
        this.angles = [];
        this.config = config;
        this.Init();
    }
    Star.Create = function(config){
        config = mergeConfig(config, DefaultConfig);
        return new Star(config);
    }
    Star.getDefaultConfig = function(){
        return DefaultConfig;
    }
    Star.prototype = {
        construstor: Star,
        Init: function (){
            const starDOM = getStarTemplate(this.config);
            this.starId = GenNonDuplicateID && GenNonDuplicateID('star_');
            starDOM.setAttribute('id', this.starId);
            this.star = this.getStar();
            this.angles = this.getAngles();
            renderStar(this);
            this.showStar();
        },
        getStar(){
            return this.star || document.getElementById(this.starId);
        },
        getAngles(){
            return this.angles.length ? this.angles : [...document.querySelectorAll(`#${this.starId} .angle`)];
        },
        getStarPos(){
            return {
                left: this.config.starPos[0],
                top: this.config.starPos[1]
            }
        },
        setStarPos(aPos){
            if(!(aPos instanceof Array) || aPos.length != 2) {
                throw new Error(`位置参数格式为：[top,left]`);
            }
            let star = this.getStar();
            this.config.starPos = aPos;
            star.style.left = (typeof aPos[0] == 'number') ? `${aPos[0]}px` : aPos[0];
            star.style.top = (typeof aPos[1] == 'number') ? `${aPos[1]}px` : aPos[1];
            return true;
        },
        getStarSize(){
            return {
                width: this.config.starSize[0],
                height: this.config.starSize[1]
            }
        },
        setStarSize(aSize){
            if(!(aSize instanceof Array) || aSize.length != 2) {
                throw new Error(`位置参数格式为：[width,height]`);
            }
            let star = this.getStar();
            let angles = this.getAngles();
            this.config.starSize = aSize;
            star.style.width = (typeof aSize[0] == 'number') ? `${aSize[0]}px` : aSize[0];
            star.style.height = (typeof aSize[1] == 'number') ? `${aSize[1]}px` : aSize[1];
            angles.forEach(angle => {
                angle.style.borderRadius = '50%';
                angle.style.width = (typeof aSize[0] == 'number') ? `${aSize[0]}px` : aSize[0];
                angle.style.height = (typeof aSize[1] == 'number') ? `${aSize[1]}px` : aSize[1];
            });
            return true;
        },
        setAnglePos(){
            let star = this.getStar();
            let left_top = star.querySelector(`#${this.starId} .angle-l-t`);
            left_top.style.position = 'absolute';
            left_top.style.top = '-50%';
            left_top.style.left = '-50%';

            let left_bottom = star.querySelector(`#${this.starId} .angle-l-b`);
            left_bottom.style.position = 'absolute';
            left_bottom.style.top = '50%';
            left_bottom.style.left = '-50%';

            let right_top = star.querySelector(`#${this.starId} .angle-r-t`);
            right_top.style.position = 'absolute';
            right_top.style.top = '-50%';
            right_top.style.left = '50%';

            let right_bottom = star.querySelector(`#${this.starId} .angle-r-b`);
            right_bottom.style.position = 'absolute';
            right_bottom.style.top = '50%';
            right_bottom.style.left = '50%';
        },
        setAngleBgc(sColor){
            let angles = this.getAngles();
            this.config.angleColor = sColor ? sColor : DefaultConfig.angleColor.defaultVal;
            angles.forEach(angle => {
                angle.style.backgroundColor = this.config.angleColor;
            })
        },
        setStarBgc(sColor){
            let star = this.getStar();
            this.config.starColor = sColor ? sColor : DefaultConfig.starColor.defaultVal;
            star.style.backgroundColor = this.config.starColor;
        },
        showStar(isShow = true){
            let star = this.getStar();
            star.style.display = isShow ? 'block' : 'none';
        },
        getConfig: function (){
            return this.config;
        },
        clearStar: function(){
            let container = document.querySelector(this.container);
            let star = this.getStar();
            container.removeChild(star);
        },
        clearAll: function(){
            let container = document.querySelector(this.container);
            container.innerHTML = '';
        }
    }
    window['Chrismas'].Star = Star;
    return Star;
})(window ? window : globalThis)