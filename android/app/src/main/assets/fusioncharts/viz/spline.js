import{_setDefaultConfig}from'./areabase';import MSSplineDataset from'../_internal/datasets/msspline';import SSCartesian from'./sscartesian';class Spline extends SSCartesian{static getName(){return'Spline'}constructor(){super(),this.defaultPlotShadow=1}getName(){return'Spline'}__setDefaultConfig(){super.__setDefaultConfig();let a=this.config;a.friendlyName='Spline Chart',a.singleseries=!0,a.defaultDatasetType='msspline',a.minimizetendency=0,a.zeroplanethickness=1,a.zeroplanealpha=40,a.showzeroplaneontop=0,a.enablemousetracking=!0,a.defaultcrosslinethickness=1,_setDefaultConfig.call(this)}getDSdef(){return MSSplineDataset}}export default Spline;