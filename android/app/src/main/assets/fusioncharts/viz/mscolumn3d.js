import MSCartesian3D from'./mscartesian3d';import Column3DDataset from'../_internal/datasets/column3d';import ColumnMultiSeriesgroup from'../_internal/datasets/groups/column.multiseries';class MSColumn3D extends MSCartesian3D{static getName(){return'MSColumn3D'}constructor(){super(),this.defaultPlotShadow=1,this.defaultZeroPlaneHighlighted=!1}getName(){return'MSColumn3D'}__setDefaultConfig(){super.__setDefaultConfig();let a=this.config;a.is3D=!0,a.friendlyName='Multi-series 3D Column Chart',a.defaultDatasetType='column3d',a.showplotborder=0,a.enablemousetracking=!0}getDSdef(){return Column3DDataset}getDSGroupdef(){return ColumnMultiSeriesgroup}}export default MSColumn3D;