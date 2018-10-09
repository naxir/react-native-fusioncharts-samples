import{parseConfiguration,TOUCH_THRESHOLD_PIXELS,CLICK_THRESHOLD_PIXELS,extend2,pluck,pluckNumber,toRaphaelColor,HUNDREDSTRING,TRACKER_FILL,hasTouch,getValidValue,getFirstValue,parseTooltext,regex,HASHSTRING,preDefStr,getDashStyle,getDefinedColor,parseUnsafeString,isFirefox,crispBound}from'../lib/lib';import{convertColor,getLightColor,getColumnColor,getFirstColor}from'../lib/lib-graphics';import ComponentInterface from'../../core/component-interface';import{addDep}from'../dependency-manager';import columnAnimation from'../animation-rules/column-animation';import{priorityList}from'../schedular';let UNDEF,MOUSEOVER='mouseOver',MOUSEOUT='mouseOut',ROLLOVER='DataPlotRollOver',ROLLOUT='DataPlotRollOut',HTP=hasTouch?TOUCH_THRESHOLD_PIXELS:CLICK_THRESHOLD_PIXELS,dropHash=regex.dropHash,PLOTBORDERCOLOR='plotBorderColor',PLOTGRADIENTCOLOR='plotGradientColor',SHOWSHADOW='showShadow',POINTER='pointer',EVENTARGS='eventArgs',DEFAULT_CURSOR=preDefStr.DEFAULT,showHoverEffectStr=preDefStr.showHoverEffectStr,SETROLLOVERATTR=preDefStr.setRolloverAttrStr,SETROLLOUTATTR=preDefStr.setRolloutAttrStr,math=Math,mathMin=math.min,mathMax=math.max,mathAbs=math.abs,crispTop={top:!0},crispRight={right:!0},crispLeft={left:!0},crispBottom={bottom:!0},mathCeil=math.ceil,mathRound=math.round,_graphicsIterator=(e={},t)=>{if('function'==typeof t)for(let o in e)if(e.hasOwnProperty(o)){let a=e[o];Array.isArray(a)?a.forEach(e=>t(e,o)):e[o]&&t(e[o],o)}},_rolloverResponseSetter=function(e,t,o,a,i){var n=t.graphics,r=n&&n.element,l=e.getFromEnv('animationManager'),s=r&&r.getData();!0!==s.draged&&(r&&0!==s.showHoverEffect&&(l.setAnimationState(MOUSEOVER),l.setAnimation({el:r,label:'rect',component:i,attr:r.getData().setRolloverAttr})),!a&&r&&e.plotEventHandler(r,o,ROLLOVER))},_rolloutResponseSetter=function(e,t,o,a,i){var n=t.graphics,r=n&&n.element,l=e.getFromEnv('animationManager'),s=r&&r.getData();!0!==s.draged&&(r&&0!==s.showHoverEffect&&(l.setAnimationState(MOUSEOUT),l.setAnimation({el:r,label:'rect',component:i,attr:r.getData().setRolloutAttr})),!a&&r&&e.plotEventHandler(r,o,ROLLOUT))},createGroup=function(e,t,o){var a=o.getFromEnv('animationManager');return a.setAnimation({el:'group',attr:{name:e},container:t,state:'appearing',component:o,label:'group'})},_removePlots=function(e=[],t){e.forEach(e=>_graphicsIterator(e&&e.graphics,t)),e.length=0};addDep({name:'columnAnimation',type:'animationRule',extension:columnAnimation});class ColumnDataset extends ComponentInterface{constructor(){super();const e=this;e.components={},e.components.removeDataArr=[],e.__hideElem=(t,o)=>{e._setRemoveAnim(t,'label'===o?'plotLabel':'rect')},e.__removeElem=(t,o)=>{e.__hideElem(t,o)},e.config.primitiveType='column'}getType(){return'dataset'}getName(){return'column'}__setDefaultConfig(){super.__setDefaultConfig();let e=this.config;e.showvalues=UNDEF,e.includeinlegend=1,e.plotfillalpha=UNDEF,e.plotfillangle=UNDEF,e.ratio=UNDEF}preConfigure(e){let t=this;return!!e&&void(t.trimData(e),t.config.JSONData=e,super.preConfigure(e))}setSkippingInfo(e){this.addToEnv('skipInfo',e||{plotsPerBin:1,drawOnlyMap:[],draw:[],hide:[],skippingApplied:!1,dragHashMap:[]})}getSkippingInfo(){return this.getFromEnv('skipInfo')||{plotsPerBin:1,drawOnlyMap:[],draw:[],hide:[],skippingApplied:!1,dragHashMap:[]}}configure(e){return!!e&&void super.configure(e)}configureAttributes(){let e=this,t=e.getFromEnv('chart'),o=e.config;e.parseAttributes(),e._setConfigure(),e.getState('visible')&&!1===o.oldVisible&&(o.appearing=!0),o.oldVisible=e.getState('visible'),e._realTimeConfigure&&e._realTimeConfigure(),!1!==t.config.hasLegend&&t.config.showLegend&&e._addLegend(),e.ErrorValueConfigure&&e.ErrorValueConfigure(),e.config.YForStackUpdated=!1,e.setState('dirty',!0)}parseAttributes(){let e,t,o,a,i=this,n=i.getFromEnv('chart'),r=n.getChildren('yAxis')[0],l=r.config.isReverse,s=i.config,g=i.config.JSONData,d=n.config.singleseries,c=n.config,p=n.getFromEnv('dataSource').chart,h=i.getFromEnv('color-manager'),m=i.getJSONIndex(),f=s.plotColor=h.getPlotColor(m),u=pluckNumber(g.dashed,p.plotborderdashed),v=pluckNumber(p.useplotgradientcolor,1),x=n.isBar,b=n.config.is3D,E=n.config.isdual;s.parentYAxis=E?'s'===pluck(g.parentyaxis&&g.parentyaxis.toLowerCase(),'p')?1:0:0,s.maxValue=-Infinity,s.minValue=1/0,s.defaultPadding={left:.5,right:.5},parseConfiguration(g,s,c,{data:!0}),s.seriesname=parseUnsafeString(g.seriesname),s.showValues=pluckNumber(g.showvalues,p.showvalues,1),s.showplotborder=pluckNumber(p.showplotborder,b?0:1),e=c.plotborderdashlen,t=c.plotborderdashgap,s.plotfillangle=pluckNumber(360-p.plotfillangle,x?180:l?90:270),s.plotfillalpha=a=pluck(g.alpha,p.plotfillalpha,HUNDREDSTRING),s.plotColor=f=pluck(g.color,f),s.legendSymbolColor=getFirstColor(s.plotColor),s.plotgradientcolor=getDefinedColor(p.plotgradientcolor,h.getColor(PLOTGRADIENTCOLOR)),v||(s.plotgradientcolor=''),s.plotborderalpha=pluck(p.plotborderalpha,a,HUNDREDSTRING),s.plotbordercolor=pluck(p.plotbordercolor,b&&!d?'#ffffff':h.getColor(PLOTBORDERCOLOR)),s.plotborderdashstyle=u?getDashStyle(e,t,o):'none',s.showShadow=b?pluckNumber(p.showshadow,1):pluckNumber(p.showshadow,h.getColor(SHOWSHADOW)),s.definedGroupPadding=mathMax(c.plotSpacePercent,0),s.includeinlegend=pluckNumber(g.includeinlegend,s.seriesname?1:0),i.setState('visible',1===pluckNumber(g.visible,!+g.initiallyhidden,1)),!0===i.getState('visible')?i._conatinerHidden=!1:i._containerHidden=!0,s.legendInteractivity=!1,i.setState('visible',1===pluckNumber(i.getState('visible'),s.JSONData.visible,!+s.JSONData.initiallyhidden,1))}trimData(e){if(!this.components&&this.components.data&&this.components.data.length)return;let t,o,a=this,i=a.components,n=a.config,r=n&&n.context,l=a.getFromEnv('chart').isRealTime,s=r&&r.prevCatlen,g=a.getFromEnv('xAxis'),d=l?0:g.getTicksLen(),c=s-d,p=i&&i.data,h=p&&p.length,m=e.data&&e.data.length||0,f=h-m;c>f?(t=c,o=d):(t=f,o=m),0<t&&this.removeData(o,t,!1)}hidePlots(){var e,t=this,o=t.components,a=o.data,i=t.getSkippingInfo(),n=i.hide,r=i.hideLabel;n.forEach(o=>{e=a[o],e&&e.graphics&&(_graphicsIterator(e.graphics,t.__removeElem),e&&(e.graphics={}))}),r.forEach(o=>{e=a[o],e&&e.graphics&&(_graphicsIterator(e.graphics,t.__removeElem),e&&(e.graphics={}))})}_setConfigure(e,t){var o,a,n,r,l,s,g,d,c=this,p=c.getFromEnv('chart'),h=p.config,m=c.config,f=c.getFromEnv('xAxis'),u=p.isRealTime,v=h.realTimeConfig&&h.realTimeConfig.numDisplaySets,x=c.getFromEnv('dataSource').categories&&c.getFromEnv('dataSource').categories[0]&&c.getFromEnv('dataSource').categories[0].category,b=m.initCatLen=u?x&&Array.isArray(x)&&x.filter(e=>!e.vline).length||0:f.getTicksLen(),E=m.JSONData||[],y=e||E.data,S=e&&e.data.length,P=m.showplotborder,w=h.plotborderthickness,C=c.components.data,k=h.isDrag,F=c.getSkippingInfo&&c.getSkippingInfo(),_=F&&F.draw||[],V=F&&F.skippingApplied;for(g=S===UNDEF&&b>v?b-v:0,o=u?pluckNumber(S,b):Math.min(b,y&&y.length),h.dragTolerance=k?(P&&5<w?w/2+1:5)+HTP:0,C||(C=c.components.data=[]),V&&(o=_.length),s=g;s<o;s++)l=_[s]||s,e?(a=e&&e.data[l]||{},t===UNDEF?(d=C.length-o+l,r=C[d]):(d=t+l,r=C[d]),n=d):(a=y&&y[l]||{},l-=g,r=C[l],n=l),r||(r=C[n]={}),r.config||(r.config={},r.graphics={}),c._plotConfigure(n,a,S),d&&d++;V&&c.addJob('configureRestID',function(){c._configureRestData()},priorityList.postRender)}_configureRestData(){var e,t,o,a,n,r=this,l=r.config,s=r.config.JSONData,g=s.data,d=r.getFromEnv('chart-attrib'),c=r.getFromEnv('xAxis'),p=c.getTicksLen(),h=r.getSkippingInfo&&r.getSkippingInfo(),m=h.drawOnlyMap,f=r.components.data;for(f||(f=r.components.data=[]),l.maxValue=-Infinity,l.minValue=1/0,a=0;a<p;a++)m[a]||(o=f[a],e=g&&g[a]||{},t=a,e.tooltext!==UNDEF&&(e.tooltext=parseTooltext(e.tooltext,[3],{label:e.label},e,d,s)),o||(o=f[a]={}),o.config||(f[a].config={}),r._plotConfigure(t,e),n&&n++)}_plotConfigure(e,t,o){var a,i,n,r,l,s,g,d,c,p,h,m,f,u,v,x,b,E,y,S,P,w,C,k,F,_,V,A,I,T,D,L,O,M,G=this,R=G.getFromEnv('chart'),B=R.config,N=G.config,H=N.JSONData,W=R.config.singleseries,J=G.getFromEnv('yAxis'),j=G.getFromEnv('xAxis'),X=G.components.data,Y=X[e],z=R.getFromEnv('dataSource').chart,U=G.getFromEnv('color-manager'),Z=N.showplotborder,K=N.plotColor,Q=B.showtooltip,$=B.yaxisname,q=B.xaxisname,ee=B.tooltipsepchar,te=B.seriesnameintooltip,oe=B.plotborderdashlen,ae=B.plotborderdashgap,ie=B.plotborderthickness,ne=pluckNumber(B.useroundedges,0),re=B.plothovereffect,le=N.plotfillangle,se=N.plotborderdashstyle,ge=Y.config,de=R.isBar,ce=R.config.is3D,pe=B.use3dlighting,he=B.realTimeConfig&&B.realTimeConfig.numDisplaySets,me=he-N.initCatLen,fe=he&&0<=me?me:0,ue=B.usedataplotcolorforlabels;M=j.getLabel(o?e-o:fe+e),ge.origLabel=O=getValidValue(parseUnsafeString(M.label)),f=ge.label=getValidValue(parseUnsafeString(M.tooltext))||O,t.tooltext!==UNDEF&&(t.tooltext=parseTooltext(t.tooltext,[3],{label:M.label},t,z,H)),ge.showValue=pluckNumber(t.showvalue,N.showValues),ge.setValue=m=J.getCleanValue(t.value,pluckNumber(B.stack100percent)),ge.setLink=pluck(t.link),ge.toolTipValue=A=J.dataLabels(m),ge.setDisplayValue=I=parseUnsafeString(t.displayvalue),ge.displayValue=pluck(I,A),T=pluckNumber(t.dashed),D=pluckNumber(t.dashlen,oe),L=ae=pluckNumber(t.dashgap,ae),null!==m&&(N.maxValue=mathMax(N.maxValue,m),N.minValue=mathMin(N.minValue,m)),ge.plotBorderDashStyle=h=1===T?getDashStyle(D,L):0===T?'none':se,W?(K=U.getPlotColor(pluckNumber(e-o,e)),K=pluck(t.color,K),ue&&j.updateTicksValues(e,{labelfontcolor:convertColor(K)}),p=pluck(t.alpha,t.borderalpha,N.plotborderalpha,d).toString()):(K=pluck(t.color,N.plotColor),p=pluck(t.alpha,N.plotborderalpha,d).toString()),c=pluck(t.ratio,N.ratio),d=pluck(t.alpha,N.plotfillalpha),ge.shadow={opacity:N.showShadow?d/100:0},0>m&&!ne&&(s=N.plotfillangle,le=de?180-le:360-le),ge.colorArr=u=getColumnColor(K+','+N.plotgradientcolor,d,c,le,ne,N.plotbordercolor,p,de?1:0,!!ce),ge.originalPlotColor=K,0!==re&&(v=pluck(t.hovercolor,H.hovercolor,z.plotfillhovercolor,z.columnhovercolor,K),x=pluck(t.hoveralpha,H.hoveralpha,z.plotfillhoveralpha,z.columnhoveralpha,d),b=pluck(t.hovergradientcolor,H.hovergradientcolor,z.plothovergradientcolor,N.plotgradientcolor),!b&&(b=''),E=pluck(t.hoverratio,H.hoverratio,z.plothoverratio,c),y=pluckNumber(360-t.hoverangle,360-H.hoverangle,360-z.plothoverangle,le),S=pluck(t.borderhovercolor,H.borderhovercolor,z.plotborderhovercolor,N.plotbordercolor),P=pluck(t.borderhoveralpha,H.borderhoveralpha,z.plotborderhoveralpha,z.plotfillhoveralpha,z.columnhoveralpha,p,d),w=pluckNumber(t.borderhoverthickness,H.borderhoverthickness,z.plotborderhoverthickness,N.showplotborder&&ie),C=t.borderhoverdashed||H.borderhoverdashed||z.plotborderhoverdashed,k=pluckNumber(t.borderhoverdashgap,H.borderhoverdashgap,z.plotborderhoverdashgap,oe),F=pluckNumber(t.borderhoverdashlen,H.borderhoverdashlen,z.plotborderhoverdashlen,ae),_=C===UNDEF?h:+C?getDashStyle(F,k):'',(B.drawTrendRegion&&!ce||1==re&&v===K)&&(v=getLightColor(v,70)),V=getColumnColor(v+','+b,x,E,y,ne,S,P.toString(),de?1:0,!!ce),ge.setRolloutAttr={fill:ce?[toRaphaelColor(u[0]),!pe]:toRaphaelColor(u[0]),stroke:Z?toRaphaelColor(u[1]):TRACKER_FILL,"stroke-width":Z?ie:0,"stroke-dasharray":h},ge.setRolloverAttr={fill:ce?[toRaphaelColor(V[0]),!pe]:toRaphaelColor(V[0]),stroke:S?toRaphaelColor(V[1]):TRACKER_FILL,"stroke-width":w,"stroke-dasharray":_}),a=ge.toolTipValue,ge.origToolText=n=getValidValue(parseUnsafeString(pluck(t.tooltext,H.plottooltext,z.plottooltext))),Q?null===a?g=!1:n===UNDEF?(te&&(r=getFirstValue(H&&H.seriesname)),g=r?r+ee:'',g+=f?f+ee:''):(l=[1,2,3,4,5,6,7],i={yaxisName:$,xaxisName:q,formattedValue:a,label:f},g=parseTooltext(n,l,i,t,z,H)):g=!1,ge.toolText=g,ge.setTooltext=g,s&&(le=s),ge._x=e,ge._y=m}updateYForStack(){var e,t,o,a,n,r,l=this,s=l.getFromEnv('chartConfig'),g=pluckNumber(s.showpercentvalues),d=pluckNumber(s.showpercentintooltip),c=l.config.JSONData,p=l.getFromEnv('chart-attrib'),h=l.getFromEnv('xAxis'),m=h.getTicksLen(),f=l.components,u=f.data,v=l.getFromEnv('stackValues'),x=g||d?-1:1,b=l.getSkippingInfo&&l.getSkippingInfo(),E=b&&b.skippingApplied,y=b&&b.draw||[],S=y&&y.length;for(E&&(m=S),a=0;a<m;a++)(o=y[a]||a,e=u[o],t=e&&e.config,e!==UNDEF)&&(n=getValidValue(parseUnsafeString(pluck(t.origToolText,c.plottooltext,p.plottooltext))),r=v[o]&&v[o].positive+x*v[o].negative||1,t._b=l._parseValues(o,t._b,r,n),s.stack100percent&&(t._y=t.value+t._b))}_parseValues(e,t,o,a){var i,n,r=this,l=r.getFromEnv('chartConfig'),s=r.components.data[e].config,g=pluckNumber(l.showpercentvalues),d=pluckNumber(l.showpercentintooltip),c=r.getState('visible'),p=s.setValue,h=pluckNumber(l.stack100percent),m=r.getFromEnv('number-formatter'),f=r.getFromEnv('yAxis'),u=s.setDisplayValue;return n=100*((c?p||0:0)/o),i=m.percentValue(n),h&&(s.value=n,t=100*((t||0)/o)),d&&(s.toolTipValue=i),g&&!u&&(s.displayValue=i),a&&(s.toolText=parseTooltext(s.setTooltext,[14,24,25,112],{percentValue:i,sum:f.dataLabels(o),unformattedSum:o})),t}_addLegend(){var e,t,o,a,i=this,n=i.getFromEnv('chart'),r=n.isBar,l=i.getFromEnv('chart-attrib'),s=i.config,g=getFirstColor(s.legendSymbolColor),d=i.getFromEnv('legend'),c=pluckNumber(l.use3dlighting,l.useplotgradientcolor,1),p=getLightColor(g,60).replace(dropHash,HASHSTRING);s.includeinlegend?(c?(t=getLightColor(g,40),e={FCcolor:{color:g+','+g+','+t+','+g+','+g,ratio:'0,30,30,30,10',angle:r?0:270,alpha:'100,100,100,100,100'}}):e={FCcolor:{color:g,angle:r?0:270,ratio:'0',alpha:'100'}},a=d.getItem(i.config.legendItemId),o={type:i.getName(),index:i.getJSONIndex(),label:getFirstValue(i.config.JSONData.seriesname)},!a&&(i.config.legendItemId=d.createItem(i),a=d.getItem(i.config.legendItemId),i.addExtEventListener('click',function(){a.itemClickFn()},a)),a.configure(o),a.setStateCosmetics('default',{symbol:{fill:toRaphaelColor(e),rawFillColor:g,stroke:toRaphaelColor(p)}}),i.getState('visible')?a.removeLegendState('hidden'):a.setLegendState('hidden')):i.config.legendItemId&&d.disposeItem(i.config.legendItemId)}legendInteractivity(e){var t=this,o=e.getLinkedParent(),a=o.getFromEnv('chart'),i=t.getState('visible'),n=t.config;if(a.getFromEnv('animationManager').setAnimationState('legendInteraction'),n.legendInteractivity=!0,i?t.hide():t.show(),isFirefox){let e=a.getChildContainer('plotGroup');e.attrs['clip-rect']&&e.attr({"clip-rect":e.attrs['clip-rect']})}n.drawnEvtListenerAttached||(n.drawnEvtListenerAttached=!0,t.addEventListener('drawn',function(){n.legendInteractivity=!1}))}createPinElem(){var e,t,o,a,n=this,r=n.getFromEnv('chart'),l=arguments[1].group,s=n.components.data,g=n.graphics.pinElems||(n.graphics.pinElems=[]),d=n.getLinkedParent().getChildContainer().columnVcanvasGroup;for(t=g.length-1;0<=t;t--)g[t].remove(),g.pop();if(n.getState('visible'))for(t=n.config.scrollMinVal;t<n.config.scrollMaxVal;t++)a=s[t],a&&a.graphics&&(e=a.graphics.element,o=e.clone().attr({transform:['T',-(r.config._visx+mathAbs(d.transform()[0][1])),-r.config.canvasBottom]}),l.appendChild(o),g.push(o))}_checkPointerOverColumn(e,t,o){var a,n,r,l,s,g,d,c,p,h,m=this,f=m.getFromEnv('chart'),u=f.config,v=u.plotborderthickness,x=u.showplotborder,b=m.components,E=b.data,y=E&&E.length,S=0,P=0,w=u.dragTolerance||0,C=m.getSkippingInfo&&m.getSkippingInfo(),k=C.plotsPerBin;for(c=mathCeil(e/k),p=(c-1)*k+1,h=p+k-1,h=h<y?h:y,d=h;d>=p;d--){if(a=E[d],!a)return;if((a._height<HTP&&(S=HTP),a._width<HTP&&(P=HTP),a._xPos||a._yPos)&&(n=a.config.setValue,x&&v!==UNDEF?g=v/2:v=g=0,null!==n&&(r=t-a._xPos+g,l=o-a._yPos+g+(0<=n?w:0),s=r>=-P/2&&r<=(P||a._width)+v&&l>=-S/2&&l<=(S||a._height)+v+(0>n?2*w:w),s)))return{pointIndex:d,hovered:s,pointObj:E[d]}}}_getHoveredPlot(e,t){var o,a,i=this,n=i.getFromEnv('chart'),r=n.isBar,l=i.getFromEnv('xAxis');return e+=l.getTranslation(),o=l.getValue(r?t:e),a=Math.round(o),0<a-o?i._checkPointerOverColumn(a,e,t)||i._checkPointerOverColumn(a-1,e,t):i._checkPointerOverColumn(a+1,e,t)||i._checkPointerOverColumn(a,e,t)}getPlotInCategoryAt(e=0,t=0){let o,a,i,n,r,l=this.components.data,s=this.getFromEnv('xAxis'),g=this.getFromEnv('yAxis'),d=s.getTranslation()||0,c=g.getTranslation()||0,p=this.getState('visible');if('category'===s.getName()&&s.config.hasCategory)a=s;else if('category'===g.getName()&&g.config.hasCategory)a=g;else return!1;return(i=a.config.isVertical,null!==i&&'undefined'!=typeof i)&&(n=Math.round(a.getValue(i?t+c:e+d)),o=l[n],r=this._getHoveredPlot(e,t),p&&r?r:!!(p&&o)&&{pointIndex:o._index,hovered:!1,pointObj:o})}_decideTooltipType(t,o){var e=this,a=e.getFromEnv('chart'),i=a.config.drawTrendRegion,n=e.components,r=e.getFromEnv('toolTipController'),l=n.data,s=l[t],g=s&&(s.config.finalTooltext||s.config.toolText),d=e.config.currentToolTip,c=o.originalEvent;g&&!i&&(d?r.draw(c,g,d):d=e.config.currentToolTip=r.draw(c,g))}_firePlotEvent(t,o,a){var e,i,n=this,r=n.getFromEnv('chart'),l=n.components,s=n.getFromEnv('toolTipController'),g=l.data,d=g[o],c=d.graphics&&d.graphics.element,p=n.config.currentToolTip;c&&(e=d.config,i=e.setLink,'mouseover'===t?(n._decideTooltipType(o,a),_rolloverResponseSetter(r,d,a,UNDEF,this),i&&(c.node.style.cursor=POINTER)):'mouseout'===t?(s.hide(p),_rolloutResponseSetter(r,d,a,UNDEF,this),i&&(c.node.style.cursor=DEFAULT_CURSOR)):'click'===t?r.plotEventHandler(c,a):'mousemove'===t?n._decideTooltipType(o,a):void 0)}createContainer(){var e,t,o,a,i=this,n=i.getType(),r=i.getFromEnv('chart'),l=i.getLinkedParent(),s=i.config.primitiveType||n;l.getChildContainer(s+'VcanvasGroup')||(s='default'),e=l.getChildContainer(s+'VcanvasGroup'),a=l.getChildContainer(s+'ShadowVcanvasGroup'),t=l.getChildContainer('commonElemGroup')||e,o=l.getChildContainer('anchorGroup')||e,i.getContainer('shadowGroup')||i.addContainer('shadowGroup',createGroup('shadow-group',a,i)),i.getContainer('errorShadowGroup')||i.addContainer('errorShadowGroup',createGroup('error-shadow-group',a,i)),i.getContainer('commonElemsGroup')||i.addContainer('commonElemsGroup',createGroup('common-elems-group',t,i)),i.getContainer('plotGroup')||i.addContainer('plotGroup',createGroup('plot-group',o,i)),i.getContainer('errorPlotGroup')||i.addContainer('errorPlotGroup',createGroup('error-plot-group',e,i)),r.hasAnchor&&i.getContainer('errorPlotGroup').insertBefore(i.getContainer('plotGroup')),i.getContainer('labelGroup')||i.addContainer('labelGroup',createGroup('label-group',l.getChildContainer('vcanvasLabelGroup'),i).attr('class','fusioncharts-datalabels'))}createCoordinates(){var e,t,o,a,n,r,l,s,g,d,c=this,p=c.components,h=p.data,m=c.getFromEnv('chart'),f=m.isBar,u=c.getFromEnv('yAxis'),v=c.getFromEnv('xAxis'),x=u.getAxisBase(),b=u.getPixel(x),E=v.config.isVertical,y=m.config.xDepth||0,S=m.config.yDepth||0,P=h.length,w=c.components,C=c.getLinkedParent(),k=C.getstackConf&&C.getstackConf(),F=w.data,_=c.getSkippingInfo&&c.getSkippingInfo(),V=_&&_.skippingApplied,A=_&&_.draw||[],I=A&&A.length;for(f||(y=-y),f&&(S=-S),V&&(P=I),n=0;n<P;n++)(a=A[n]||n,e=F[a],t=e&&e.config,e!==UNDEF)&&(o=t._b,g=v.getPixel(k&&k[a]&&k[a].x||t._x),r=(isFinite(g)?g:0)+y,d=u.getPixel(t._y),l=(isFinite(d)?d:0)+S,s=(o?u.getPixel(o):b)+S,E?(t._Px=l,t._Py=r,t._Pby=r,t._Pbx=s):(t._Px=r,t._Py=l,t._Pby=s,t._Pbx=r),c.getLineShift&&(t._Py+=c.getLineShift('y')))}setContainerVisibility(e){var t,o=this,a=o.getContainer();for(t in a)a.hasOwnProperty(t)&&(!1!==o.getState('visible')||!1!==o._conatinerHidden&&o._conatinerHidden!==UNDEF||e?(a[t].show(),o._conatinerHidden=!1):(a[t].hide(),o._conatinerHidden=!0))}plotAnimManager(e,t,o,a){var i,n,r,l,s,g,d,c,p=this,h=p.getFromEnv('chart'),m=h.getFromEnv('animationManager'),f=h.config.is3D,u=h.config,v=p.getState('visible'),x=t.x,b=p.getSkippingInfo&&p.getSkippingInfo(),E=b&&b.draw||[],y=p.getFromEnv('plotGroup3d');l=e&&e.config,n=l&&l.setValue,d=0>n,f?(r=d?y.negativeGroupArray:y.positiveGroupAarray,g=r[h.isBar?r.length-1-o:o]):g=p.getContainer('plotGroup'),i=e.graphics.element,c=t,s={el:i||(f?'cubepath':'rect'),container:g,attr:v&&c,doNotRemove:!0,props:{originalIndex:E[o]||o},index:o,length:a,component:p,label:'rect'},v||(s.callback=function(){this.hide()}),e.graphics.element=i=m.setAnimation(s),f&&(i.appendTo(g),(u.isstacked&&d||!u.isstacked&&h.isBar)&&i.toBack()),null===e.config.setValue?(i.remove(),delete e.graphics.element):p.getState('visible')&&i.show(),l._oldPx=l._Px,l._oldX=x,v&&(e.oldPrevDataObj=e.prevDataObj)}flushOnScroll(e,t){let o,a=this,i=a.components,n=i.data;for(let r=e;r<=t-1;r++)(o=n[r],!!(o&&o.graphics))&&(_graphicsIterator(o.graphics,a.__removeElem),o.graphics={})}removingDraw(){var e=this,t=e.components.data;t.forEach(t=>{_graphicsIterator(t.graphics,e.__removeElem),delete t.graphics}),super.removingDraw()}_contextChanged(){var e;this.config.context||(this.config.context={});let t,o=this,a=o.config.context,i=a.shift,n=o.getFromEnv('xAxis'),r=o.getFromEnv('yAxis'),l=a.axisLimit,s=!1,g={yAxis:{limit:r.getVisibleConfig()},xAxis:{limit:n.getVisibleConfig()}};return g.yAxis.limitPixel={min:r.getPixel(g.yAxis.limit.minValue),max:r.getPixel(g.yAxis.limit.maxValue)},g.xAxis.limitPixel={min:n.getPixel(g.xAxis.limit.minValue),max:n.getPixel(g.xAxis.limit.maxValue)},t=JSON.stringify(g),l!==t&&(a.axisLimit=t,s=!0),i!==o.getFromEnv('shift')&&(a.shift=o.getFromEnv('shift'),s=!0),a.prevColNum!==o.getFromEnv('numOfColumns')&&(a.prevColNum=o.getFromEnv('numOfColumns'),s=!0),n.getProcessLen?e=n.getProcessLen():n.getTicksLen&&(e=n.getTicksLen()),a.prevCatlen!==e&&(a.prevCatlen=e,s=!0),!!this.getFromEnv('chart').isRealTime||s}calculateScrollRange(){let e,t=this,o=t.config,a=t.getFromEnv('xAxis'),i=a.getTicksLen(),n=t.getSkippingInfo&&t.getSkippingInfo()||{},r=n.skippingApplied,l=n.draw||[],s=n.labelDraw||[],g=l.length;e=r?g-1:i,o.scrollMinVal=mathMax(mathRound(a.getVisibleConfig().minValue),0)-1,o.scrollMaxVal=mathMin(mathRound(a.getVisibleConfig().maxValue)+1,e)+1,e=r?s.length-1:i,o.scrollMinValForLabel=mathMax(mathRound(a.getVisibleConfig().minValue),0)-1,o.scrollMaxValForLabel=mathMin(mathRound(a.getVisibleConfig().maxValue)+1,e)+1}drawPlots(){var e,t,o,a,n,r,l,s,g,d,c,p=this,h=p.getFromEnv('chart'),m=p.config,f=h.config,u=f.plothovereffect,v=p.components.data,x=p.getContainer('shadowGroup'),b=m._oldStartIndex,E=m._oldEndIndex,y=p.getSkippingInfo&&p.getSkippingInfo(),S=y&&y.draw;for(g=m.scrollMinVal,d=m.scrollMaxVal,g>b&&p.flushOnScroll(b,g>E?E:g),d<E&&p.flushOnScroll(d<b?b:d,E),m._oldStartIndex=g,m._oldEndIndex=d,(t=g,c=d-1);t<d;t++,c--)(e=S[t]||t,a=v[e],!!a)&&(r=a.config,s=r.props.element.attr,p.plotAnimManager(a,s,t,d),l=a.trackerConfig,n=a.graphics.element,!!n)&&(n.shadow(r.shadow,x).data('BBox',o),h.config.enablemousetracking&&n.data(EVENTARGS,l.eventArgs).data(showHoverEffectStr,u).data(SETROLLOVERATTR,r.setRolloverAttr||{}).data(SETROLLOUTATTR,r.setRolloutAttr||{}));m.appearing&&(m.appearing=!1)}setColumnPosition(){let e,t,o=this;if((e=o.getFromEnv('plotWidth'))===UNDEF){let t,a,i,n,r=o.getFromEnv('xAxis'),l=this.getFromEnv('chartConfig'),s=o.getSkippingInfo(),g=s.plotsPerBin,d=mathMax(l.plotSpacePercent,0),c=mathMax(pluckNumber(d,20)%100,0),p=1===g?c/200:0,h=r.getPixel(0),m=r.getPixel(g),f=o.getFromEnv('chart'),u=f.isBar?f.config.maxBarHeight:f.config.maxColWidth,v=mathAbs(m-h),x=!0;t=(1-.01*d)*v||mathMin(v*(1-2*p),u*1),e=t/1,n=t/2,a=h-n,i=m-n,i-(a+t)<4&&(x=!1),0===c&&(x=!0),o.addToEnv('isCrisp',x)}o.addToEnv('columnWidth',e),t=o.getFromEnv('shift')||0,o.addToEnv('columnXShift',t-o.getFromEnv('columnWidth')/2)}parsePlotAttributes(e,t){var o,a,n,r,l,s,g,d,c,p,h,m,f,u,v,b,E,y,S,P,w,C,k,F,_,V=this,A=V.config,I=V.config.JSONData,T=V.getFromEnv('chart'),D=T.getFromEnv('dataSource').chart,L=T.config.isstacked,O=V.config,M=V.groupManager,G=V.getJSONIndex(),R=t,i=V.getState('visible'),B=T.config,N=T.config.is3D,H=T.isBar,W=B.xDepth||0,J=B.yDepth||0,j=V.getFromEnv('yAxis'),X=V.getFromEnv('xAxis'),Y=B.showtooltip,z=!1!==V.getState('visible'),U=V.components,Z=U.data,K=e.config,Q=j.getAxisBase(),$=j.yBasePos=j.getPixel(Q),q=pluckNumber(O.plotborderthickness,B.plotborderthickness),ee=pluckNumber(B.useroundedges,0),te=O.use3dlighting,oe=mathMin(A.yAxisMinPixel,A.yAxisMaxPixel),ae=M&&M.stackConf,ie=V.getFromEnv('columnXShift'),ne=T.config.viewPortConfig,re=ne.x,x=ne.scaleX,le=pluckNumber(B.showplotborder);f=K.setLink,b=K.colorArr||[],X.config.isVertical?(d=V.getFromEnv('columnWidth'),g=ie):(l=V.getFromEnv('columnWidth'),s=ie),e.graphics||(Z[R].graphics={}),v=K.displayValue,z||(K._Py=K._Pby),P=mathMin(K._Px,K._Pbx)+(s||0)+re*x,w=mathMin(K._Py,K._Pby)+(g||0),ae&&(P-=l/2),C=l||mathAbs(K._Px-K._Pbx),k=d||mathAbs(K._Py-K._Pby),o=H?0<K._Px-K._Pbx?crispRight:crispLeft:0<K._Py-K._Pby?crispBottom:crispTop,m=getValidValue(parseUnsafeString(pluck(K.origToolText,I.plottooltext,D.plottooltext))),V.fineTunePlotDimension&&(_=V.fineTunePlotDimension(P,w,k,C,R),P=_.xPos,w=_.yPos,C=_.width,k=_.height),a=P,n=w,c=C,p=k,r=X.getPixel(1)-X.getPixel(0)-(H?p:c),isFinite(p)||(p=0),i&&(!(5>r&&5>V.getFromEnv('columnWidth'))&&(y=crispBound(P,w,c,p,q,o,L)),y?(a=y.x,n=y.y,q=y['stroke-width'],c=y.width,p=y.height||1):(a=P,n=w),X.config.isVertical?a===oe&&(a-=q,c+=q):n+p===oe?p+=q:n===oe&&(n-=q,p+=q),K.setRolloutAttr&&(K.setRolloutAttr['stroke-width']=A.showplotborder?q:0)),h=K.finalTooltext=!1===K.toolText?'':K.toolText+(m?'':K.toolTipValue),E=K.plotBorderDashStyle,S=e.trackerConfig={},S.eventArgs={index:R,link:f,value:K.setValue,displayValue:v,categoryLabel:K.origLabel,toolText:h,id:'',datasetIndex:G,datasetName:I.seriesname,visible:i},F=$===n+(0<u?p:0),K.props={element:{attr:{x:a||0,width:c||0,height:p||0,y:n||0,r:ee,fill:toRaphaelColor(b[0])||'',stroke:le?toRaphaelColor(b[1])||'':TRACKER_FILL,"stroke-width":le?q:0,"stroke-dasharray":E,"stroke-linejoin":'miter',visibility:i,cursor:f?POINTER:''}}},N&&(K.props.element.attr.noGradient=!te,K.props.element.attr.xDepth=W,K.props.element.attr.yDepth=J),e._xPos=a+W,e._width=c,e._yPos=n-J,e._height=p,e._index=R,e._plotBorderThickness=q,(f||Y)&&(p<HTP&&(n-=(HTP-p)/2,p=HTP),S.attr={x:a,y:n,width:c,height:p,r:ee,cursor:f?POINTER:'',stroke:TRACKER_FILL,"stroke-width":le?q:0,fill:TRACKER_FILL,visibility:i}),K.oldValue=u,e._oldYBaseTouched=F}parseLabelAttributes(e){var t,o,a,i,n,r,l,s,g,d,c,p,h,m=this,f=m.getFromEnv('chart'),u=f.config,v=f.getFromEnv('smartLabel'),x=f.config.dataLabelStyle,b=m.config,E=b.legendInteractivity,y=m.getState('visible'),S=u.rotatevalues?270:0;return(d=e&&e.config,g=d&&d.setValue,e===UNDEF||g===UNDEF||null===g||!0===d.labelSkip)?(d&&delete d.labelSkip,h=e&&e.graphics,void(h&&h.label&&h.label.hide())):(i=e.graphics,!!i)?(l=e._yPos,s=e._xPos,o=d.displayValue,c=d.showValue,c&&null!==g?void((!E||!d._state)&&(v.setStyle(x),a=v.getOriSize(o),d._state=S?{labelWidth:a.height,labelHeight:a.width}:{labelWidth:a.width,labelHeight:a.height}),p=m._getValuePosition({labelWidth:d._state.labelWidth,labelHeight:d._state.labelHeight,width:e._width,height:e._height,yPos:l,xPos:s,value:g}),r=p.textX,n=p.textY,!d.props&&(d.props={}),d.props.label={attr:{x:r,y:n,text:o,"text-bound":[x.backgroundColor,x.borderColor,x.borderThickness,x.borderPadding,x.borderRadius,x.borderDash],opacity:y?1:0}},t=d.props.label.attr,!E&&(t['line-height']=x.lineHeight,t.fill=x.color)):void(i.label&&(i.label.attr({"text-bound":[]}),i.label.hide()))):void 0}allocatePosition(){var e,t,o,a,n,r,l,s,g=this,d=g.getFromEnv('chart'),c=d.config,p=c.showpercentvalues,h=c.showpercentintooltip,m=g.config,f=g.components.data.length,u=g.getFromEnv('yAxis'),v=g.components,x=v.data,b=c.isstacked,E=+c.stack100percent,y=g.getSkippingInfo&&g.getSkippingInfo(),S=y&&y.draw;for(g.deleteFromEnv('columnWidth'),g.setColumnPosition(),g.calculateScrollRange(),b&&(E||p||h)&&g.updateYForStack(),g.createCoordinates(),a=u.getLimit(),l=u.getPixel(a.max),s=u.getPixel(a.min),n=m.scrollMinVal,r=m.scrollMaxVal,l>s?(m.yAxisMaxPixel=l,m.yAxisMinPixel=s):(m.yAxisMaxPixel=s,m.yAxisMinPixel=l),t=0;t<f;t++)(e=S[t]||t,!(d.hasScroll&&(e<n||e>r)))&&(o=x[e],!!o)&&(g.parsePlotAttributes(o,e),g.parseLabelAttributes(o))}draw(){var e,t,o=this,a=o.config,i=o.getState('visible'),n=o.getFromEnv('xAxis'),r=n.getPixel(0),l=n.getPixel(1),s=o.getFromEnv('groupMaxWidth'),g=o.getFromEnv('chart'),d=g.config,c=d.xDepth||0,p=o.getFromEnv('yAxis'),h=a.drawn,m=p.getLimit(),f=m.max,u=m.min,v=o._contextChanged(),x=o.getSkippingInfo&&o.getSkippingInfo()||{},b=x.skippingApplied;s||(s=mathAbs(l-r),o.addToEnv('groupMaxWidth',s));(o.getState('removed')||o.getState('dirty')||v&&i)&&(!h&&o.createContainer(),o.setContainerVisibility(!0),b&&o.hidePlots(),o.drawPlots(),o.drawCommonElements&&!o.config.skipCommonElements&&o.drawCommonElements(),e=a.scrollMinValForLabel,t=a.scrollMaxValForLabel,a.drawn?o.drawLabel(e,t):o.addJob('labelDrawID',function(){o.drawLabel(e,t)},priorityList.label),a.drawn=!0,o.removePlots(),a.oldGroupMaxWidth=s,a.oldDataIsPositiveNegative=0<f&&0>u,a.oldZeroAxisPos=p.getPixel(p.getAxisBase())+c,o.drawErrorValue&&o.drawErrorValue(),a.prevVisible=i,a.catDiff=0)}show(){var e=this,t=e.getLinkedParent(),o=e.getFromEnv('legend');o&&o.getItem(e.config.legendItemId)&&o.getItem(e.config.legendItemId).removeLegendState('hidden'),e.setState('visible',!0),e.config.appearing=!0,e._conatinerHidden=!1,e.setState('dirty',!0),t.childChanged(),e.config.appearing=!1,e.asyncDraw()}hide(){var e=this,t=e.getLinkedParent(),o=e.getFromEnv('legend');o&&o.getItem(e.config.legendItemId)&&o.getItem(e.config.legendItemId).setLegendState('hidden'),e.setState('dirty',!0),e.setState('visible',!1),t.childChanged(),e.asyncDraw()}drawLabel(e,t){var o,a,n,r,l,s,g,d,c,p,h,m,f,u=this,v=u.getFromEnv('chart'),x=u.getFromEnv('animationManager'),b=v.config,E=u.getFromEnv('xAxis'),y=u.getFromEnv('paper'),S=u.getState('visible'),P=v.getFromEnv('smartLabel'),w=v.config.dataLabelStyle,C=u.config,k=E.getTicksLen(),F=u.components,_=F.data,V=F.pool,A=b.rotatevalues?270:0,I=C.labelDrawn,T=u.getSkippingInfo&&u.getSkippingInfo(),D=T&&T.skippingApplied,L=T&&T.labelDraw||[],O=L.length,M=pluckNumber(e,0),G=pluckNumber(t,D?O:k),R=O===Math.abs(G-(M+1)),B=function(){this.attr({"text-bound":[]}),this.hide()};for(f=u.getContainer('labelGroup'),f.css({fontFamily:w.fontFamily,fontSize:w.fontSize,fontWeight:w.fontWeight,fontStyle:w.fontStyle}),f.show(),P.useEllipsesOnOverflow(v.config.useEllipsesWhenOverflow),P.setStyle(w),r=M;r<G;r++){if(n=D&&R?L[r]:r,o=_[n],d=o&&o.config,g=d&&d.setValue,o===UNDEF||g===UNDEF||null===g||!0===d.labelSkip){d&&delete d.labelSkip,m=o&&o.graphics,m&&m.label&&m.label.hide();continue}if(l=o.graphics,!!l){if(c=d.showValue,!c||null===g){l.label&&(l.label.attr({"text-bound":[]}),l.label.hide());continue}a=d.props.label.attr,s=o._xPos,!l.label&&I&&v.isRealTime&&(p=extend2({},a),p.x=a.x-s+(o._newXPos||0),p.transform=y.getSuggestiveRotation(A,p.x,a.y),V&&V.label[0]&&(l.label=V.label[0],V.label.splice(0,1))),a.transform=y.getSuggestiveRotation(A,a.x,a.y),!(h=l.label)&&V&&V.label[0]&&(h=l.label=V.label[0],V.label.splice(0,1)),h=x.setAnimation({el:l.label||'text',attr:a,component:u,label:'plotLabel',index:n,container:f,callback:!S&&B}),h&&h.show(),l.label||(l.label=u.addGraphicalElement('plotLabel',h,!0))}}C.labelDrawn=!0}_getValuePosition(e){var t,o,a,i,n,r,l,s,g,d=this,c=d.getFromEnv('chart'),p=c.getChildren(),h=c.config,m=p.yAxis[0],f=h.xDepth||0,u=h.yDepth||0,v=h.canvasTop,x=h.canvasHeight+u,b=e.yPos,E=c.config.is3D,y=c.config.isstacked,S=h.valuepadding+2,P=e.height,w=e.width,C=h.placevaluesinside,k=e.labelHeight,F=m.getAxisConfig('isReverse'),_=e.value,V=e.xPos;return F||(0>_?s=!1:s=!0),n=pluck(s,0>_),r=g=k+S,i=P,l=.5*g+S,a=b-l,o=V+.5*w,n?(t=v+x-(b+P+u),a=b):t=b-v,y?(a=b+.5*P+(u||0),a=mathMin(v+x-.5*r,a),a=mathMax(v+.5*r,a),o-=f):C?i>=r?(a=b+(n?P-l:l),E&&(o-=f,a+=u)):t>=r?(a=b+(n?P+l:-l),E&&n&&(o-=f,a+=u)):(a=b+(n?P-l:l),E&&(o-=f,a+=u)):t>=r?(a=b+(n?P+l:-l),E&&(n?(o-=f,a+=u):o-=f/2)):i>=r+l?(a=b+(n?P-l:l),E&&(o-=f,a+=u)):(a=b+(n?P-l:l),E&&(o-=f,a+=u)),{textX:o,textY:a}}getDataLimits(){return{max:this.config.maxValue,min:this.config.minValue}}addData(e,t,o){var a,n=this,r=n.components,l=r.data,s=e.data,g=s.length;for(r.addDataArr=e.data,0===t?n.startPosition=!0:(t+g===l.length||t===UNDEF)&&(n.startPosition=!1),a=0;a<g;a++)t===UNDEF?l.push({config:{}}):l.splice(t+a,0,{config:{}});n._setConfigure(e,t),o&&n.asyncDraw()}removeData(e,t,o){var a,n,r=this,l=r.getFromEnv('chart'),s=r.components,g=s.data,d=s.removeDataArr||(s.removeDataArr=[]);for(t===UNDEF&&(t=1),e=e||0,e+t!==g.length&&l.isRealTime?(0===e||e===UNDEF)&&(r.endPosition=!1):r.endPosition=!0,s.removeDataArr=d=d.concat(g.splice(e,t)),n=d.length,a=n-1;0<=a;a--)if(!d[a]){d.splice(a,1);continue}r.removeDataLen=n,o&&r.asyncDraw()}updateData(e,t,o){var a=this,i=a.config,n=i.maxValue,r=i.prevMin,l=a.getFromEnv('chart'),s=a.groupManager||a,g=l.getFromEnv('xAxis'),d=l.getFromEnv('yAxis');a._setConfigure(e,t),a.getDataLimits(),(i.maxValue!==n||i.minValue!==r)&&(a.maxminFlag=!0),o&&(l._setAxisLimits(),g&&g[0].asyncDraw(),d&&d[0].asyncDraw(),s.asyncDraw())}removePlots(){var e=this,t=e.components,o=t&&t.removeDataArr;_removePlots(o,e.__removeElem)}removeGraphicElem(e,t){this.__removeElem(e,t)}getAxisValuePadding(){return this.config.defaultPadding}getCanvasPadding(){var e,t,o,a,i,n,r=Math.max,l=this,s=l.config||(l.config={}),g=l.components||{},d=l.getFromEnv('chart'),c=d.config.rotatevalues,p=l.getFromEnv('xAxis'),h=l.getFromEnv('yAxis'),m=d.config.dataLabelStyle,f=l.getSkippingInfo(),u=f.skippingApplied,v=f.draw,x=g.data||[],b=u?v[0]:0,E=u?v[v.length-1]:x.length-1,y=s.leftMostData||x[b],S=s.rightMostData||x[E],P={},w={},C=0,k=0,F=0,_=p.getPixel(0),V=l.getFromEnv('smartLabel'),A={paddingLeft:0,paddingRight:0,paddingTop:0,paddingBottom:0},I=0,T=p.getValuePadding(),D=s.topMostData,L=s.bottomMostData;return l.setColumnPosition(),n={xPosOffset:l.getFromEnv('columnXShift'),columnWidth:l.getFromEnv('columnWidth'),height:UNDEF},y&&(e=y.config,a=e.showValue,o=e&&e.anchorProps||{},a&&(t=e.displayValue,V.useEllipsesOnOverflow(d.config.useEllipsesWhenOverflow),V.setStyle(m),w=V.getOriSize(t),I=c?w.height:w.width),null!==e.setValue&&(i=p.getPixel(T.left),C=o.enabled&&pluckNumber(o.radius,0)+pluckNumber(o.borderThickness,0)/2||0,F=C-(i-_),0>F&&(F=0),k=(I||0)/2-(i-_)-(n&&n.xPosOffset+n.columnWidth/2||0),0>k&&(k=0)),A.paddingLeft=mathMax(F,k)),F=k=0,S&&(e=S.config,a=e.showValue,o=e&&e.anchorProps||{},a&&!c&&(t=e.displayValue,V.setStyle(m),P=V.getOriSize(t),I=c?P.height:P.width),null!==e.setValue&&(i=p.getPixel(T.right),C=o.enabled&&pluckNumber(o.radius,0)+pluckNumber(o.borderThickness,0)/2||0,F=C-(i-_),0>F&&(F=0),k=(I||0)/2-(i-_)+(n&&n.xPosOffset+n.columnWidth/2||0),0>k&&(k=0)),A.paddingRight=mathMax(F,k)),D&&(e=D.config,a=e.showValue,o=e&&e.anchorProps||{},null!==e.setValue&&(C=pluckNumber(o.radius,0)+pluckNumber(o.borderThickness,0)/2,k=r(C-(h.getPixel(e.setValue.y)-h.getPixel(h.getLimit().max)),0)),A.paddingTop=k),L&&(e=L.config,o=e&&e.anchorProps||{},null!==e.setValue&&(C=pluckNumber(o.radius,0)+pluckNumber(o.borderThickness,0)/2,k=r(C-(h.getPixel(h.getLimit().min)-h.getPixel(e.setValue.y)),0)),A.paddingBottom=k),A}getEventArgs(){var e=this,t=e.config||{},o=e.config.JSONData||{},a={datasetName:o.seriesname,datasetIndex:e.getJSONIndex(),id:t.userID,visible:!e.getState('visible')};return a}getData(){return this.components.data}setJSONIndex(e){this.config.index=e}getJSONIndex(){return this.config.index||0}remove(e){let t=this,o=t.config.legendItemId,a=t.getFromEnv('chart').getChildren('legend'),i=t.getFromEnv('legend');a&&a.length&&i&&o&&i.disposeItem(o),super.remove(e)}setMaxMin(e){var t,o,a,n,r=this,l=r.components,s=l.data,g=l.removeDataArr,d=r.config,c=s.length,p=-Infinity,h=+Infinity,m=d.maxValue,f=d.minValue,u=g.length,v=!1;if(e)v=m===e.startValue||f===e.startValue||m<e.config.setValue||f>e.config.setValue;else if(u)for(t=0;t<u;++t)if(n=g[t]&&g[t].config&&g[t].config.setValue,m===n||f===n){v=!0;break}if(v){for(t=0;t<c;t++)s[t]&&(o=s[t].config,a=o.setValue,a!==UNDEF&&(p=mathMax(p,a),h=mathMin(h,a)));d.maxValue=p,d.minValue=h}}}export{_removePlots};export default ColumnDataset;