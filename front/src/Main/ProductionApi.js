// import axios from 'axios';

const BERT_URL = process.env.REACT_APP_BERT_URL
const SERVER_URL = process.env.REACT_APP_SERVER_URL

async function createData(body, url) {
  // console.log(JSON.stringify(body));
  const res = await fetch(url, {
    method: "POST",
    credentials: 'include', //クレデンシャルを含める指定
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({ text:memo.text, time:memo.time})
    body: JSON.stringify(body)
  })
  return res;
  //res.json: 成功{"data": data}, 失敗{"error": error_messages}
  //res.status: 成功200, 失敗400
}

async function updateData(body, url) {
  const res = await fetch(url, {
    method: "PATCH",
    credentials: 'include', //クレデンシャルを含める指定
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res;
  //res.json: 成功{"data": data}, 失敗{"error": error_messages}
  //res.status: 成功200, 失敗404
}

async function deleteData(url) {
  const res = await fetch(url, {
    method: "DELETE",
    credentials: 'include', //クレデンシャルを含める指定
    mode: 'cors',
  });
  return res;
  //res.status: 成功200, 失敗404
}


//memoのapiクラス
export class MemoDataSource {
  API_URL = SERVER_URL + "memos";
  constructor() {
  }

  //ページidに対応するメモの取得
  async getMemoIndex(page_id) {
    const res = await fetch(this.API_URL + `?page_id=${page_id}`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    try {
      const json = await res.json(); //メモが空の時例外
      console.log(json);
      return json; //{"memos": (memo)の配列}
    } catch (err) {
      //例外時の処理とreturn
    }
  }

  //メモの新規作成
  async createMemo(memo, page_id) {
    const res = createData({ text: memo.text, time: memo.time, parent_id: memo.parent_id, user_id: memo.user_id, status: memo.status },
      this.API_URL + `?page_id=${page_id}`);
    return res;
  }

  //メモの更新
  async updateMemo(memo) {
    const res = updateData({ text: memo.text, time: memo.time, status: memo.status },
      this.API_URL + '/' + memo.id);
    return res;
  }

  //メモの削除
  async deleteMemo(memo) {
    const res = deleteData(this.API_URL + '/' + memo.id);
    return res;
  }
}

//userのapiクラス
export class UserDataSource {
  API_URL = SERVER_URL + "users";
  constructor() {
  }

  // userのメールログイン
  async loginUser(user) {
    const res = await fetch(SERVER_URL + 'authes/login', {
      method: "POST",
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email, password: user.password
      })
    })
    console.log(res);
    return res;
  }


  async loginGoogleUser(id_token, name) {
    const res = await fetch(SERVER_URL + 'authes/login/google', {
      method: "POST",
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_token: id_token, name: name })
    })
    return res;
    //res.json 成功{"user":user}
    //res.status 成功200, 失敗400
  }

  async isLogIn() {
    const res = await fetch(SERVER_URL + 'authes/islogin', {
      credentials: 'include',
      mode: 'cors'
    });
    return res;
    //成功 {user}
    //失敗 
  }

  async logoutUser() {
    const res = await fetch(SERVER_URL + `authes/logout`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
      method: 'DELETE'
    });
    return res;
    //成功 200
  }

  async getUser(user_id) {
    const res = await fetch(this.API_URL + `/${user_id}`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    return res;
    //成功 200 {"user":user}
    //失敗：404
  }

  //userの新規作成
  async createUser(user, access_token) {
    const res = await createData(
      user,
      this.API_URL,
      access_token
    );
    console.log(res);
    return res;
  }

  //userの更新
  async updateUser(user) {
    const res = updateData(user,
      this.API_URL + '/' + user.id);
    return res;
  }

  //userの削除
  async deleteUser(user_id) {
    const res = deleteData(this.API_URL + '/' + user_id);
    return res;
  }
}

//pageのapiクラス
export class PageDataSource {
  API_URL = SERVER_URL + "pages";
  constructor(user) {
    this.user = user
  }

  //userに対応するpageのindex
  async getPageIndex(user) {
    if (!user) user = this.user
    const res = await fetch(this.API_URL + `?user_id=${user.id}`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    try {
      const json = await res.json(); //ページが空の時例外
      console.log(json);
      return json; //{"page_list": (page, "memos": (memoの配列でサイズ2未満)  の配列)}
    } catch (err) {
      //例外時の処理とreturn
      console.log("no pages");

    }
  }

  async getAllTagIndex(user) {
    if (!user) user = this.user
    const pages = (await this.getPageIndex(user));
    console.log(pages)
    const tags = [];
    (pages).forEach(page => {
      tags.push(...(page.tags))
    });
    console.log("all tag", tags)
    return tags
  }

  //pageの取得
  async getPage(page_id) {
    const res = await fetch(this.API_URL + '/' + page_id, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    return res;
    //成功 200 {"page": page,  "tags": xxxx配列}
    //失敗：404
  }

  async getPageByToken(page_token) {
    const res = await fetch(this.API_URL + '/share?page_token=' + page_token, {
      method: "GET",
      // credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    return res;
    //成功 200 {"page": page,  
  }

  async createPage(page) {
    let res;
    if (page.workspace_id == "home") {
      res = createData({ url: page.url, title: page.title }, this.API_URL + `?user_id=${page.user_id}`);
    } else {
      res = createData({ url: page.url, title: page.title, workspace_id: page.workspace_id }, this.API_URL + `?user_id=${page.user_id}`);
    }
    return res
  }

  //pageの更新
  async updatePage(page) {
    const res = updateData({ url: page.url, title: page.title },
      this.API_URL + '/' + page.id);
    return res;
  }

  //pageの削除
  async deletePage(page) {
    const res = deleteData(this.API_URL + '/' + page.id);
    return res;
  }

  async searchPage(keywords) {
    const res = await fetch(this.API_URL + '/\search', {
      method: "POST",
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keywords: keywords })
      // body: JSON.stringify({ user_id: user.id, keywords: keywords, workspace_id: workspace_id })
    }).then(res => res.json());
    console.log(res.pages);
    return res;
    //res.json 成功{"pages" (page とmemoの配列)の配列}
    //res.status 成功200, 失敗400
  }

  async postBrowseState(page_id, post_data) {
    const res = createData(post_data, this.API_URL + `/${page_id}/analytics`);
    return res;
  }

  async getBrowseState(page_id) {
    const res = await fetch(this.API_URL + `/${page_id}/analytics`, {
      credentials: 'include',
      mode: 'cors',
    });
    return res;
  }

}

//tagのapiクラス
export class TagDataSource {
  API_URL = SERVER_URL + 'tags';
  constructor() {
  }

  //自動tagの生成
  async createAutomatedTag(page_id) {
    const res = await fetch(this.API_URL + `/automate?page_id=${page_id}`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    return res;
    //成功 200 {"tags": tagの配列}
    //失敗 404，500
  }

  //tag一覧の取得
  async getTagIndex(page_id) {
    const res = await fetch(this.API_URL + `?page_id=${page_id}`, {
      credentials: 'include', //クレデンシャルを含める指定
      mode: 'cors',
    });
    return res;
    //成功 200 {"tags": tagの配列}
    //失敗 404
  }

  //手動tagの追加
  async createManualTag(text, page_id) {
    const res = createData({ text: text },
      this.API_URL + `?page_id=${page_id}`);
    return res;
  }

  //手動タグの更新
  async updateManualTag(tag) {
    const res = updateData({ text: tag.text },
      this.API_URL + '/' + tag.id);
    return res;
  }

  //タグの削除
  async deleteTag(tag) {
    const res = deleteData(this.API_URL + '/' + tag.id);
    return res;
  }
}

export class WSPageDataSource {
  API_URL = SERVER_URL + 'ws';
  init = {
    credentials: 'include',
    mode: 'cors',
  }

  constructor(workspace_id) {
    this.workspace_id = workspace_id;
  }

  async getPageIndex() {
    const workspace_id = this.workspace_id
    const res = await fetch(this.API_URL + `/${workspace_id}/pages`, this.init);
    return await res.json();
  }

  async searchPage(keywords) {
    const workspace_id = this.workspace_id
    const res = await fetch(this.API_URL + '/search', {
      method: "POST",
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ workspace_id: workspace_id, keywords: keywords })
    }).then(res => res.json());
    console.log(res.pages);
    return res;
  }
}

export class WorkspaceDataSource {
  API_URL = SERVER_URL + 'ws';
  init = {
    credentials: 'include',
    mode: 'cors',
  }

  async getWorkspaceIndex() {
    const res = await fetch(this.API_URL, this.init);
    return res;
  }

  async getWorkspace(workspace_id) {
    const res = await fetch(this.API_URL + `/${workspace_id}`, this.init);
    return res;
  }

  async createWorkspace(workspace) {
    const users = workspace.users.map((user_p) => { return ([user_p.user_id, user_p.permission]) })
    const res = createData({ name: workspace.name, users: users }, this.API_URL);
    return res;
  }

  async updateWorkspace(workspace) {
    // const users = workspace.users.map((user_p) => { return ([user_p.user_id, user_p.permission]) })
    console.log(workspace.users)
    const res = updateData({ name: workspace.name, users: workspace.users }, this.API_URL + `/${workspace.id}`);
    return res;
  }

  async deleteWorkspace(workspace_id) {
    const res = deleteData(this.API_URL + `/${workspace_id}`);
    return res;
  }

  async quitWorkspace(workspace_id) {
    const res = deleteData(this.API_URL + `/${workspace_id}/user`);
    return res;
  }

  async getWorkspaceUsers(workspace_id) {
    const res = await fetch(this.API_URL + `/${workspace_id}/users`, this.init);
    return res;
  }

  async getWorkspaceByToken(token) {
    const res = await fetch(this.API_URL + `/token?workspace_token=${token}`, this.init);
    return res;
  }

  async updateOwner(workspace_id, user_id) {
    const res = updateData({ user_id: user_id }, this.API_URL + `/${workspace_id}/owner`);
    return res;
  }

  async addUser(workspace_id, users) {
    console.log(users);
    const res = createData({users: users}, this.API_URL + `/${workspace_id}/users`);
    return res;
  }

  async joinWorkspace(post_data) {
    const res = createData(post_data, this.API_URL + `/${post_data.workspace_id}`);
    return res;
  }
}


export class BertDataSource {
  async getSentment(text_list) {
    let np_scores = [];
    for (let text of text_list) {
      // console.log("before", text)
      const res = await fetch(BERT_URL + `?text=${text}`, {
        mode: 'cors',
      });
      // console.log("after,", res)
      const json = await res.json();
      // console.log(json)
      np_scores.push(json.body)
    }
    return np_scores;
  }
}