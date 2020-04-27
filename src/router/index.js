import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/common/Login";
import Register from "@/components/common/Register";
import Home from "@/components/user/Home";
import ArticleList from "@/components/common/ArticleList";
import CateMana from "@/components/admin/CateMana";
import DataCharts from "@/components/admin/DataCharts";
import PostShare from "@/components/common/PostShare";
import UserMana from "@/components/admin/UserMana";
import ModalDetail from "@/components/common/ModalDetail";
import ResumeHome from "@/components/common/postresume/view/ResumeHome";
import ShareDetail from "@/components/common/ShareDetail";
import ShareList from "@/components/common/ShareList";
import UserDetail from "@/components/user/UserDetail";
import AdminHome from "@/components/admin/AdminHome";

Vue.use(Router);

const BaseMessage = () =>
  import(
    /* webpackChunkName: "baseMsg" */ "../components/common/postresume/BaseMessage.vue"
  );
const PersonalSkill = () =>
  import(
    /* webpackChunkName: "skillMsg" */ "../components/common/postresume/PersonalSkill.vue"
  );
const InternExperience = () =>
  import(
    /* webpackChunkName: "internMsg" */ "../components/common/postresume/InternExperience.vue"
  );
const EducationExperience = () =>
  import(
    /* webpackChunkName: "educationMsg" */ "../components/common/postresume/EducationExperience.vue"
  );
const ProjectExperience = () =>
  import(
    /* webpackChunkName: "projectMsg" */ "../components/common/postresume/ProjectExperience.vue"
  );

export default new Router({
  routes: [
    {
      path: "/",
      name: "登录",
      hidden: true,
      component: Login
    },
    {
      path: "/register",
      name: "注册",
      hidden: true,
      component: Register
    },
    {
      path: "/home",
      name: "",
      component: Home,
      hidden: true
    },
    {
      path: "/home",
      component: Home,
      name: "简历管理",
      iconCls: "fa fa-file-text-o",
      children: [
        {
          path: "/articleList",
          name: "简历列表",
          component: ArticleList,
          meta: {
            keepAlive: true
          }
        },
        {
          path: "/postArticle",
          name: "在线发布",
          // component: PostShare,
          redirect: "/base",
          component: ResumeHome,
          children: [
            { path: "/base", name: "基本信息", component: BaseMessage },
            { path: "/skill", name: "专业技能", component: PersonalSkill },
            { path: "/intern", name: "工作经历", component: InternExperience },
            {
              path: "/education",
              name: "教育简历",
              component: EducationExperience
            },
            { path: "/project", name: "项目经验", component: ProjectExperience }
          ],
          meta: {
            keepAlive: false
          }
        },
        {
          path: "/preview",
          name: "编辑历史",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () =>
            import(
              /* webpackChunkName: "showEdit" */ "../components/common/postresume/view/ShowEdit.vue"
            ),
          hidden: true
        },
        {
          path: "/modalDetail",
          name: "模板管理",
          component: ModalDetail,
          //hidden: true,
          meta: {
            keepAlive: true,
          }
        }
      ]
    },
    {
      path: "/home",
      component: Home,
      name: "用户详情",
      iconCls: "fa fa-bar-chart",
      children: [
        {
          path: "/userDetail",
          iconCls: "fa fa-user-o",
          name: "用户详情",
          component: UserDetail,
          meta: {
            keepAlive: false
          }
        }
      ]
    },
    {
      path: "/home",
      component: Home,
      name: "分享社区",
      iconCls: "fa fa-users",
      children: [
        {
          path: "/postShare",
          component: PostShare,
          name: "知识分享",
          iconCls: "fa fa-share"
        },
        {
          path: "/shareList",
          //component: UserRank,
          component: ShareList,
          name: "分享列表",
          iconCls: "fa fa-list"
        },
        {
          path: "/shareDetail",
          name: "分享详情",
          component: ShareDetail,
          hidden: true,
          meta: {
            keepAlive: false
          }
        }
      ]
    },
    {
      path: "/adminhome",
      name: "",
      component: AdminHome,
      hidden: true
    },
    {
      path: "/adminhome",
      component: AdminHome,
      name: "用户管理",
      children: [
        {
          path: "/user",
          iconCls: "fa fa-user-o",
          name: "用户管理",
          component: UserMana
        }
      ]
    },
    {
      path: "/adminhome",
      component: AdminHome,
      name: "栏目管理",
      children: [
        {
          path: "/cateMana",
          iconCls: "fa fa-reorder",
          name: "栏目管理",
          component: CateMana
        }
      ]
    },
    {
      path: "/adminhome",
      component: AdminHome,
      name: "数据统计",
      iconCls: "fa fa-bar-chart",
      children: [
        {
          path: "/charts",
          iconCls: "fa fa-bar-chart",
          name: "数据统计",
          component: DataCharts
        }
      ]
    },
    {
      path: "/adminhome",
      component: AdminHome,
      name: "简历管理",
      iconCls: "fa fa-file-text-o",
      children: [
        {
          path: "/adminArticleList",
          name: "简历列表",
          component: ArticleList,
          meta: {
            keepAlive: true
          }
        },
        {
          path: "/adminPostArticle",
          name: "在线发布",
          // component: PostShare,
          redirect: "/adminBase",
          component: ResumeHome,
          children: [
            { path: "/adminBase", name: "基本信息", component: BaseMessage },
            { path: "/adminSkill", name: "专业技能", component: PersonalSkill },
            {
              path: "/adminIntern",
              name: "工作经历",
              component: InternExperience
            },
            {
              path: "/adminEducation",
              name: "教育简历",
              component: EducationExperience
            },
            {
              path: "/adminProject",
              name: "项目经验",
              component: ProjectExperience
            }
          ],
          meta: {
            keepAlive: false
          }
        },
        {
          path: "/adminPreview",
          name: "编辑历史",
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () =>
            import(
              /* webpackChunkName: "showEdit" */ "../components/common/postresume/view/ShowEdit.vue"
            ),
            hidden: true,
        },
        {
          path: "/adminModalDetail",
          name: "模板管理",
          component: ModalDetail,
          //hidden: true,
          meta: {
            keepAlive: false
          }
        }
      ]
    },
    {
      path: "/adminhome",
      component: AdminHome,
      name: "用户详情",
      iconCls: "fa fa-bar-chart",
      children: [
        {
          path: "/adminDetail",
          iconCls: "fa fa-user-o",
          name: "用户详情",
          component: UserDetail
        }
      ]
    }
  ]
});
