;(function() {
    "use strict";
    window.console = window.console || {log:function(){}}
    var $$ = pc
    var Drag = function(config){
      var dom = $$(config.target)
      var parent = dom[0].parentNode
      var _self = this
      var first = !0
      var pPosition = $$.setStyle(parent,{position:'relative'})
      var clone = dom[0].cloneNode(true);
      clone.id = ''
      clone.className += ' draging placeholder-drag'
      clone.innerHTML = ''
      _self.startIndex=0;
      _self.config = config
      _self.dom = $$(config.target);
      if(_self.config.cancel) {
        _self.config.cancel = config.cancel.split(',');
      }
      _self.init(first)

      $$.setStyle(clone,{position:'absolute',display:'none',margin:0})
      parent.appendChild(clone)
      $$.addEvent(parent,'mouseup',_self.mouseup())
      $$.addEvent(parent,'select',function(e){
        e.preventDefault()
        return !1
      })
      $$.addEvent(document,'mousemove',_self.mousemove())
      _self.clone = clone
      _self.parent = parent
      return _self
    }
    Drag.prototype.init = function(first){
      var _self = this
      var vDom = []
      var orgData = []
      var data = []
      var config = _self.config
      var dom = $$.getElems(config.target)
      var mousedownElm = config.mousedownElm

      !first && _self._remove()
      $$.each(dom,function(elm,i){
        elm.onselectstart = function() {var el = elm, s = el.style;
      s.userSelect = "none";
      s.webkitUserSelect = "none";
      s.MozUserSelect = "none";
      el.setAttribute("unselectable", "on"); // For IE and Opera
       return false; };
        
        if(!first && !elm.getAttribute('data-drag'))return;
        var ofL = elm.offsetLeft
        var ofT = elm.offsetTop
        var $$elm = $$(elm)
        var dataOrg = {
          left: elm.offsetLeft,
          top: elm.offsetTop,
          width: elm.offsetWidth,
          height: elm.offsetHeight
        }
        orgData.push($$.extend({},dataOrg))
        data.push(dataOrg)
        vDom.push({
          elm : elm,
          index: i,
          mousedownElm: $$.getElem(mousedownElm,elm) || elm,
          fn: _self.mousedown(i)
        })
        $$.addEvent(elm, 'selectstart', function(e){return false} )
        $$.addEvent(vDom[i].mousedownElm,'mousedown',vDom[i].fn)
        elm.setAttribute('data-i',i)
        elm.setAttribute('data-drag',true)
      })
      _self.data = data
      _self.vDom = vDom
      _self.orgData = orgData
    }
    Drag.prototype.getData = function(i){
      return this.data[i]
    }
    Drag.prototype._change = function(old,_new,after){
      var _self = this
      // old = indexs.indexOf(old)
      var oldElm = _self.vDom[old].elm
      var newElm = _self.vDom[_new].elm
      var parent = _self.parent
      if(after)pc.insertAfter(newElm,oldElm)
      else parent.insertBefore(oldElm,newElm)
      _self.newIndex = _new
    }
    Drag.prototype.mousedown = function(i){
      var _self = this
      // var
      
      return function(e){
        _self._start = !0
        _self.startIndex = i
        var _data = _self.getData(i)
        var left = _data.left
        var top = _data.top
        var target = _self.vDom[i].elm;
        var clone = _self.clone;
        // _self.parentNode.getElementsByTagName('textarea')[0].value = val;
        _self.source = [e.pageX,e.pageY]
        // console.log(clone.innerHTML);
        // $$.setStyle(target,{visibility:'hidden'})
        // $$.setStyle(clone,{left:left+'px',top:top+'px',display:'block'})
      }
    }
    Drag.prototype._remove = function(e){
      var _self = this
      var vDom = _self.vDom
      $$.each(vDom,function(obj,i){
        $$.removeEvent(obj.mousedownElm,'mousedown',obj.fn)
      })
    }
    Drag.prototype.mousemove = function(){
      var _self = this
      return function(e){

        // for (var tmp1 = 0, _len = _self.dom.length; tmp1<_len; tmp1++) {
        //   if(_self.dom[tmp1]===e.target) {
        //     break;
        //   }
        //   return;
        // }

        for (var tmp2 = 0, _len = _self.config.cancel.length; tmp2<_len; tmp2++) {
          if(_self.config.cancel[tmp2]===e.target.nodeName.toLowerCase()) {
            return;
          }
        } 
        // alert(1)
        if(!_self._start)return !1;
        var clone = _self.clone
        var i = _self.startIndex
        var _data = _self.getData(i)
        var source = _self.source
        var _top = _data.top
        var _left = _data.left
        var left = _left + e.pageX - source[0]
        var top = _top + e.pageY - source[1]
        var index = 0
        var org = _self.orgData
        var ln = org.length
        var _ln = ln - 1
        var max = org[_ln].top
        var min = org[0].top
        var after = !1

        var target = _self.vDom[_self.startIndex].elm
        

        if(top < min){
          index = 0
        }else if(top > max){
          index = _ln
          after = !0
        }else{
          index = (function(org,top,ln,max,_ln,min){
           var n,rz
           while(ln--){
             n = org[ln].top - top
             if((n < 10) && (n > -10)){
               rz = ln
               break;
             }
           }
           return rz
         })(org,top,ln,max,_ln,min) || i
        }
        if(i !== index){
          _self._change(i,index,after)
        }
        if(!clone.isCloneInner) {
          var val = target.getElementsByTagName('textarea')[0].value;
          clone.innerHTML = target.innerHTML;
          clone.getElementsByTagName('textarea')[0].value = val;
          clone.isCloneInner = true;
        }

        if (_self.config.axis===undefined) {
          $$.setStyle(clone,{left:left+'px',top:top+'px'})
        } else if (_self.config.axis==='y') {
          $$.setStyle(clone,{top:top+'px'})
        } else {
            $$.setStyle(clone,{left:left+'px'})
        }
        if (Math.abs(top)>5 ||  Math.abs(left)>5) {
          $$.setStyle(target,{visibility:'hidden'})
        }
        $$.setStyle(clone,{display:'block'})
        // $$.setStyle(clone,{left:left+'px',top:top+'px'})
      }
    }
    Drag.prototype.mouseup = function(e){
      var _self = this
      return function(e){
        // _self._remove()
        _self.clone.isCloneInner = false;
        var target = _self.vDom[_self.startIndex].elm
        _self._start = !1
        $$.setStyle(target,{visibility:'visible'})
        $$.setStyle(_self.clone,{display:'none'})
        _self.init()
      }
    }
    Drag.prototype.append = function(elm,i){
      var _self = this
      var ln = _self.vDom.length - 1
      var clone = i ? _self.dom[i] : (_self.clone || _self.dom[ln])
      var parent = _self.parent
      parent.appendChild(elm)
      parent.insertBefore(elm,clone)
      elm.setAttribute('data-drag',true)
      _self.init()
    }
    window.Drag = Drag;
})();
