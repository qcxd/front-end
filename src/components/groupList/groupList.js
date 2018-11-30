// components/groupList/groupList.js
Component({

  properties: {
    groups: {
      type: Array,
      value: []
    },
    currentGroupId: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath){
        let index = this.calculateGroupIndex(newVal);
        this.setData({
          groupIndex: index
        })
        if(!this.data.clicked){
          this.triggerEvent('select', {
            id: newVal
          })
        }
      }
    },
  },
/**
 * group:
 * {
      "name": "OnechatTest-2",
      "privacy": "CLOSED",
      "id": "297266204331648"
    }
 */
  data: {
    groupIndex: 0,
    clicked: false
  },


  methods: {
    selectGroup(e){
      let index = e.currentTarget.dataset.index;
      let groupid = e.currentTarget.dataset.groupid;
      this.setData({
        groupIndex: index
      })
      this.data.clicked = true;
      this.triggerEvent('select', {
        id: groupid
      })
      setTimeout(_ => {
        this.data.clicked = false;
      }, 100);
    },
    calculateGroupIndex(groupId){
      let groups = this.data.groups;
      for(let i=0; i<groups.length; i++){
        if(groups[i].id == groupId){
          return i;
        }
      }
      return false;
    },
  },
  ready(){
    
  }
})
