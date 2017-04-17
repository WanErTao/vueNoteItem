	//存取localStrage中的数据
	var store ={
		save(key,value){
			localStorage.setItem(key,JSON.stringify(value));
		},
		fetch(key){
			return JSON.parse(localStorage.getItem(key))||[];
		}
	}
	var list =store.fetch('tao');
	var vm=new Vue({
		el:'.content',
		data:{
			list:list,
			todo:'',
			editTodos:'' ,     //记录正在编辑的数据
			befoerTitle:'',    //记录编辑之前数据的title
			visibility:'all',    //通过这个属性值的变化对这个值就行筛选
		},
		watch:{
			// list:function(){   //监控list这个属性，当这个属性对应的值发生变化时就会执行这个函数
			// 	store.save('tao',this.list)
			// }
			list:{
				handler:function(){    //深度监控
					store.save('tao',this.list)
				},
				deep:true
			}
		},
		computed:{
			noCheckedLength:function(){
				return this.list.filter(function(item){
					return !item.checked
				}).length
			},
			filteredList:function(){
				var filter={
					all:function(list){
						return list;
					},
					finished:function(list){
						return list.filter(function(item){
							return item.checked
						})
					},
					unfinished:function(list){
						return list.filter(function(item){
							return !item.checked
						})
					}
				}
				return filter[this.visibility]?filter[this.visibility](list):list;
			}
		},
		methods:{
			addTodo(){     //添加任务
				//事件处理函数的this指向的是当前这个根实例
				if(this.todo){
					this.list.push({
						title:this.todo,
						checked:false
					});
					this.todo=''
				}else{
					alert('请添加任务！')
				}
			},
			deleteTodo(todo){    //删除任务
				var index=this.list.indexOf(todo);
				this.list.splice(index,1)
			},
			editTodo(todo){    //编辑任务
				this.befoerTitle=todo.title;
				this.editTodos=todo;
			},
			editTodoed(todo){   //编辑成功
				this.editTodos='';
			},
			cancelTodoed(todo){   //取消编辑
				todo.title=this.befoerTitle;
				this.befoerTitle='';
				this.editTodos='';
			}
		},
		directives:{
			'focus':{
				update(el,binding){
					if(binding.value){
						el.focus();
					}
				}
			}
		}
	});

	function watchHashChange(){
		var hash = window.location.hash.slice(1);
		vm.visibility=hash;
	}
	watchHashChange();
	window.addEventListener("hashchange",watchHashChange);

	// var oLink =document.getElementsByClassName('action')[0];
	// var aLink =oLink.getElementsByTagName('a');
	// for(var i=0;i<aLink.length;i++){
	// 	aLink[i].onclick=function(){
	// 		for(var i=0;i<aLink.length;i++){
	// 			aLink[i].className='';
	// 		}
	// 		this.className='active';
	// 	}
	// }
	// $('.action').find('a').bind('click',function(){
	// 	$(this).addClass('active').siblings().removeClass('active');
	// })
