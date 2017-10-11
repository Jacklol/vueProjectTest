<template>

  <div id="app">
    <div>
        <label class="typo__label">Select repository</label>
        <multiselect v-model="value"  track-by="nameWithOwner" label="nameWithOwner" placeholder="Select one" :options="options" :searchable="true" :allow-empty="false" @select="onSelect"></multiselect>
        <pre class="language-json"><code>{{ value }}</code></pre>
    </div>
     <span  class="string" v-if="selected">ISSUES:</span>
     <div  v-for="issue in issuesList" :key="issue.node.title">
       <div class="card"  v-on:click="requestComments(issue)">
        <span class='title'>{{ issue.node.title }}</span>
          <span class='status'  >{{ issue.node.state }}</span>
        <div v-html=" issue.node.bodyHTML"></div>
        <div v-show="issue==selectedIssue">
          <span class="string">Comments:</span>
          <span class="string">{{commentsInfo}}</span>
          <div  class="cardComments" v-for="comment in comments" :key="comment.comment.createdAt" >
            <div  class="comment" v-html=" comment.comment.bodyHTML"></div>
            
            {{ comment.comment.createdAt | formatDate}}
          </div>
        </div>
      </div>
    </div>

    <img src="./assets/logo.png">
  </div>
</template>

<script>
 import Multiselect from 'vue-multiselect'

export default {
  
  name: 'app',components: { Multiselect },
  data () {
    
    return {
      key:"",
      a:"a989f3a231a91bf49c0",
      b:"dbf6c1a797c1370ef9fc6",
      
        value: null,
        selected: null,
        options: [],
      msg: 'Welcome to Your Vue.js App',
      commentsInfo:"loading",
      hello: '',
      selectedIssue:{},
      comments:[],
      userData: {},
      issuesList: [],
       repositories:[ ],
       
    } 
    
     
  },
  mounted(){
   
    this.requestRepositories();
  },
  methods: {
    onSelect(option){
       console.log( this.selected);
      this.selected=option;
       console.log(this.selected);
         console.log("raborar");
        this.request(option);
    },
      nameWithLang ({ name, nameWithOwner }) {
      return `${name} — [${nameWithOwner}]`
     
    },
    
    requestRepositories(){
      this.key=this.a+this.b;
      console.log("requestrequest1");
         console.log( this.repositories)
            fetch('https://api.github.com/graphql',{  
              method: 'POST',  
              headers: {  
                "Authorization": "Bearer "+this.key, 
                "Content-Type":"application/json; charset=utf-8"
              },  
              body: '{"query":"query{ user(login: \\"octocat\\"){repositories(last:100 affiliations: OWNER){ nodes { nameWithOwner,name,owner{ login}}}}}","variables":"{}"}'
              })
              .then((response)=> {   response.json().then((data) =>{  
                this.options=data.data.user.repositories.nodes;
                   console.log( this.options);  console.log(  data);  
                    console.log(  data.data.user.repositories.nodes);
               
              });  
            })  
            .catch(function (error) {  
            console.log('Request failed', error);  
            });
    },
    requestComments(issue){
      this.comments=[];
      this.selectedIssue=issue;
      this.commentsInfo="loading";
       console.log(this.selectedIssue==issue);
      console.log(issue);
       console.log(this.ownerLogin);
        console.log(this.optionName);
       fetch('https://api.github.com/graphql',{  
              method: 'POST',  
              headers: {  
                "Authorization":"Bearer "+this.key, 
                "Content-Type":"application/json; charset=utf-8"
              },  
              body: '{"query":"query {repository(owner:\\"'+this.ownerLogin+'\\", name:\\"'+this.optionName+'\\"){ issue(number:'+issue.node.number+'){comments(last: 20){edges{comment: node {createdAt,  bodyHTML}}}}}}","variables":"{}"}'
              })
              .then((response)=> {   response.json().then((data) =>{  
                this.comments=data.data.repository.issue.comments.edges;
                if (  this.comments.length==0) {
                   this.commentsInfo="no comments"
                }else{
                  this.commentsInfo="";
                }
                  console.log( this.comments);  
              });  
            })  
            .catch(function (error) {  
            console.log('Request failed', error);  
            });
    },
    request(option){
            console.log("requestrequest");
            console.log(option);
             console.log(option.owner.login);
             this.ownerLogin=option.owner.login;
             this.optionName=option.name;
            fetch('https://api.github.com/graphql',{  
              method: 'POST',  
              headers: {  
                "Authorization": "Bearer "+this.key, 
                "Content-Type":"application/json; charset=utf-8"
              },  
              body: '{"query":"query { repository(owner:\\"'+option.owner.login+'\\", name:\\"'+option.name+'\\") { issues(last:100) { edges { node { state,title,bodyHTML,number } } } } }","variables":"{}"}'
              })
              .then((response)=> {   response.json().then((data)=> {  
                this.issuesList=data.data.repository.issues.edges;
                console.log( this.issuesList);  
                 console.log( this.issuesList.length);  
                
              });  
            })  
            .catch(function (error) {  
            console.log('Request failed', error);  
            });
    }

  }
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.card{
  border: solid 2px black;
  background-color:gainsboro;
}
.cardComments{
    border: solid 2px red;
    background-color:lightcyan
}
.comment{
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  
}
.title{
   font-size: 1.2rem;
   color: #4f374e;
}
.string{
   font-size: 1.2rem;
   color: #1f374e;
}
.status{
   color: #1f374e;
   font-weight: bold;
}
</style>
