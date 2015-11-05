# dragsort
拖动排序插件

### 使用方法
`` 
function makeDrag() {
    window.picDragSort = new Drag({
      target:'#J-imgupload-list .imgupload-wrap',
      mousedownElm: '#J-imgupload-list .imgupload-wrap',
      axis: 'y',
      cancel: 'textarea,input'
    });
}

if (pc.getElems('#J-imgupload-list .imgupload-wrap').length) {
    makeDrag();
}
`` 
