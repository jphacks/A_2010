import React, { useState, useEffect, useContext, memo } from 'react'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Select from "@material-ui/core/Select";
import { Button, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import "./Main.css";
// import Memo from "./Memo/Memo";
import VideoPlayer from "./VideoPlayer";
import MemoList from './Memo/MemoList';
import WriteMemoForm from './Memo/WriteMemoForm';
import NewPage from '../NewPage/NewPage';
import Title from './Memo/Titile'
import Loading from '../Loading';
import TagList from './Tag/TagList';
import TagForm from './Tag/TagForm';

//import * as MemoAPI from './LocalApi';
import { MemoDataSource, PageDataSource, BertDataSource, WorkspaceDataSource } from './ProductionApi';

import { UserInfoContext } from '../context'
import { MemoAuther } from '../Auth/Authers';
import Analytics from './Analytics/Analytics';
import useInterval from 'use-interval';


const useStyles = makeStyles((theme) => ({
  root: {
    //padding: '2vh 1vw',
    width: '100%',
    height: '70%',
    //backgroundColor:"#ffffff",
    backgroundColor: "#e7ecec",
  }
}));


const MemoAPI = new MemoDataSource();
const PageApi = new PageDataSource();
const BertApi = new BertDataSource();
// const workspaceApi = new WorkspaceDataSource();

function Main(props) {
  const classes = useStyles();
  const [memos, setMemos] = useState([]);
  const [reloader, setReloader] = useState(0);
  const [player, setPlayer] = useState({
    time: 0,
    player: null,
    playing: false,
    duration: null
  });
  const [page, setPage] = useState({ title: "", url: "", tags: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [colorList, setColorList] = useState([]);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [memoMode, setMemoMode] = useState('all');
  const [isWriting, setIsWriting] = useState(0);
  const [isAnalyticsMode, setAnalyticsMode] = useState(false);
  const [colorMode, setColorMode] = useState("None");
  const { workspace_id } = useParams();

  const N_SPLIT = 100;
  const POST_INTERVAL = 5000;
  const GET_INTERVAL = 1000;

  const page_id = props.page_id;

  if (props.mode == "user") {
    var user = userInfo;
    var identifer = page_id;
    var loadPage = () => {
      return PageApi.getPage(identifer).then(res =>
        res.json()
      )
    }
  } else if (props.mode == "token") {
    var user = { id: "", token: true }
    var identifer = props.token;
    var loadPage = () => {
      return PageApi.getPageByToken(identifer).then(res =>
        res.json()
      )
    }
  }

  const memoAuther = new MemoAuther(user);

  const autoReload = useInterval(() => {
    if (!isAnalyticsMode) {
      setReloader(reloader + 1);
    }
  }, GET_INTERVAL);

  // For Analytics
  useInterval(() => {
    if (!isAnalyticsMode && player.duration) {
      var dayTime = new Date();
      var nowState;
      if (player.playing == true) { nowState = 'play' }
      else if (isWriting == 1) { nowState = 'write_memo' }
      else { nowState = 'else' }
      let fixed_time = null
      for (let i = 0; i < N_SPLIT; i++) {
        fixed_time = parseInt(i * player.duration / N_SPLIT);
        if (fixed_time >= player.time) break
      }
      const day = dayTime.getFullYear() + '/' + (dayTime.getMonth() + 1) + '/' + dayTime.getDate()

      PageApi.postBrowseState(page_id, {
        state: nowState,
        time: fixed_time,
        day: day
      });
    }
  }, POST_INTERVAL);

  useEffect(() => {
    setIsLoading(true);
    loadPage().then((page) => {
      setPage({ ...page });
      setMemos(page.memos)
      setIsLoading(false);
    })
  }, [identifer])

  useEffect(() => {
    // setIsLoading(true);
    loadPage().then((new_page) => {
      setPage({ ...new_page });
      const new_memo = new_page.memos.map(m => {
        const stay = memos.find(old => old.text == m.text);
        if (stay) return ({ ...m, color: stay.color })
        else return m
      })
      setMemos(new_memo)
      if (isLoading) setIsLoading(false);
    })
  }, [reloader])

  useEffect(() => {
    const mode = colorMode;
    const text_list = memos.map(t => t.text);
    if (mode == "None") {
      var new_memos = memos.map(memo => {
        return {
          ...memo,
          color: null
        }
      });
      setMemos(new_memos);
    } else {
      BertApi.getSentment(text_list).then(res => {
        console.log(res);
        const calcColorFromSentiment = (mode, np) => {
          if (mode === "positive") {
            if (np.positiveness > 1.0) {
              return "#FFB300";
            } else if (np.positiveness > 0.5) {
              return "#FFD54F"
            }
          } else if (mode === "negative") {
            if (np.negativeness > 1.0) {
              return "#33C7FF";
            } else if (np.negativeness > 0.5) {
              return "#33F2FF";
            }
          }
        }
        var new_memos = memos.map((memo, i) => {
          return {
            ...memo,
            color: calcColorFromSentiment(mode, res[i])
          }
        })
        setMemos(new_memos);
      });
    }
  }, [colorMode]);

  function withUpdate(fun) {
    fun.then(() => setReloader(reloader + 1));
  }

  function handleDelete(memo) {
    withUpdate(MemoAPI.deleteMemo(memo));
  }
  function handleChange(memo) {
    withUpdate(MemoAPI.updateMemo(memo));
  }

  function handleSubmit(memo) {
    console.log(memo);
    withUpdate(MemoAPI.createMemo(memo, page_id));
  }

  function handleChangeTitle(title) {
    withUpdate(PageApi.updatePage({ url: page.url, title: title, id: page_id }));
  }

  function handleWriting() {
    if (true) {
      setIsWriting(1)
      setPlayer({ ...player, playing: false })
    }
  }

  function changeMemoByStatus(event) {
    const mode = event.target.value;
    setMemoMode(mode);
  }

  function changeMemoColor(event) {
    const mode = event.target.value;
    setColorMode(mode);
  }

  function handleWriteEnd() {
    if (true) {
      setIsWriting(0)
      setPlayer({ ...player, playing: true })
    }
  }

  const endAnalyticsMode = () => {
    setAnalyticsMode(false);
  }

  const mymemos = memos.filter(memo => memo.user_id == userInfo.id);
  switch (memoMode) {
    case 'onlyme':
      var visMemos = mymemos;
      break;
    case 'pub':
      var visMemos = mymemos.filter(memo => memo.status == "pub");
      break;
    case 'pri':
      var visMemos = mymemos.filter(memo => memo.status == "pri");
      break;
    default:
      var visMemos = memos;
  }

  const VisMemoHamburger =
    (userInfo.workspace_id != "home") ?
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item>
          <Box style={{ marginRight: "20px" }}>メモの表示切替</Box>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <Select onChange={changeMemoByStatus}
              defaultValue="all"
              className={classes.selectEmpty}
              inputProps={{ "aria-label": "Without label" }}>
              <MenuItem value="all">全員</MenuItem>
              <MenuItem value="onlyme">自分</MenuItem>
              <MenuItem value="pub">public</MenuItem>
              <MenuItem value="pri">private</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      : null


  return (
    <div className="Main">
      <Loading open={isLoading}>
      </Loading>


      {isAnalyticsMode ?
        <Grid item xs={12}>
          <Analytics page={page} memos={memos} onClick={endAnalyticsMode} />
        </Grid>
        :

        <main className={classes.root}>
          {/* <timeContext.Provider value={{ time, setTime }}> */}
          <Grid item>
            <Title title={page.title} onChange={handleChangeTitle} />
          </Grid>
          <Grid container className={classes.grid} direction="row">
            <Grid item xs={10} md={6}>
              <Grid container className={classes.grid} direction="column">

                <Grid item xs={10} md={12}>
                  <TagList tags={page.tags} withUpdate={withUpdate} />
                </Grid>
              </Grid>
              <Grid container className={classes.grid} direction="row">
                <Grid item xs={12} md={12}>
                  <TagForm page_id={page.id} withUpdate={withUpdate} />
                </Grid>

                <Grid item xs={12}>
                  <VideoPlayer className="" url={page.url} players={{ player, setPlayer }} />
                </Grid>
                <Grid item xs={12}>
                  {memoAuther.canCreate(page) ?
                    <WriteMemoForm onSubmit={handleSubmit} player={player} user_id={userInfo.id} onWriting={handleWriting} onWriteEnd={handleWriteEnd} />
                    :
                    null
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={10} md={6}>
              <Grid container direction="column" >
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item >
                    <Button color="primary" onClick={() => { setAnalyticsMode(true) }}>Analytics Mode</Button>
                    <Box style={{ marginRight: "20px" }}>AIによるハイライト</Box>
                    <FormControl className={classes.formControl}>
                      <Select onChange={changeMemoColor}
                        defaultValue="None"
                        className={classes.selectEmpty}
                        inputProps={{ "aria-label": "Without label" }}>
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="positive">ポジティブ</MenuItem>
                        <MenuItem value="negative">ネガティブ</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>

                {VisMemoHamburger}

                <Grid item>
                  <MemoList
                    memoAuther={memoAuther}
                    memos={visMemos}
                    onChange={handleChange}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    player={player}
                    user_id={userInfo.id}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* </timeContext.Provider> */}
        </main>
      }
    </div>
  );
}

export default Main;
