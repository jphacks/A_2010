import Button from '@material-ui/core/Button';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useLocation } from "react-router-dom";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PageList from '../User/PageList';
import { UserInfoContext } from '../context';
import { PageAuther } from '../Auth/Authers';
import queryString from 'query-string';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    //marginTop: theme.spacing(2),
  },
}));

function Home(props) {
  const [state, setState] = useState({ pages: [] });
  const { userInfo } = useContext(UserInfoContext);
  const [isTagMode, setTagMode] = useState(false);
  const classes = useStyles();
  const [searchTag, setSearchTag] = useState('all');

  const location = useLocation();
  const qs = queryString.parse(location.search);
  const user = userInfo;
  const pageAuther = new PageAuther(user);
  const dataSource = props.dataSource;
  const s_pages = state.pages ? state.pages : null;

  const q_seach_word = (qs.search != null ? qs.search : "");
  const search_word = props.search_word ? props.search_word : q_seach_word
  // console.log(q_seach_word,search_word)

  // console.log(s_pages)
  const tags = Array.from((pages => {
    let tags = new Set();
    (pages).forEach(page => {
      (page.tags).forEach(tag => tags.add(tag.text))
    })
    return tags
  })(s_pages));

  const pages = s_pages.map(page => {
    page.auth = pageAuther.makeAuth(page);
    return page
  }).filter(p => p.auth.canRead);



  const loadPages = () => {
    if (search_word == "") {
      dataSource.getPageIndex().then(pages => {
        console.log("get pages", pages)
        if (pages === undefined) {

        } else {
          setState({ ...state, pages: pages })
        }
      })

    } else {
      dataSource.searchPage(search_word.split(' '))
        .then(pages => {
          // console.log(props.search_word)
          // console.log("load page".pages);
          setState({ ...state, pages: pages });
        })
    }
  }


  useEffect(() => {
    loadPages();
  }, [search_word, userInfo.workspace_id]);

  const withUpdate = (doSomething) => {
    doSomething.then(() => { loadPages() })
  }

  const handleTagChange = (event) => {
    setSearchTag(event.target.value);
  };

  // if (q_seach_word && (search_word == "")) {
  //   props.onSearchChange(q_seach_word);
  // }


  if (isTagMode) {
    var tag_variant = "contained"
    var normal_variant = ""
  } else {
    var tag_variant = "";
    var normal_variant = "contained";
  }
  if (searchTag === "all") {
    var filtered_tag = tags;
  } else {
    var filtered_tag = [searchTag]
  }
  const pageListsWithTag = filtered_tag.map(tag => {
    let filteredpages = [];
    pages.forEach(page => (
      page.tags.forEach(e => (
        tag == e.text && filteredpages.push(page)
      ))
    ))
    return (
      <>
        <h1>{tag}</h1>
        <PageList pages={filteredpages} withUpdate={withUpdate} />
      </>
    )
  })

  const renderSelectTag = () => (
    <div>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button variant={normal_variant} onClick={() => { setTagMode(false); }}>all</Button>
        <Button variant={tag_variant} onClick={() => { setTagMode(true); }}>タグごと</Button>
      </ButtonGroup>
      {isTagMode ?
        <FormControl className={classes.formControl}>
          {/*InputLabel id="demo-simple-select-label">タグを検索</InputLabel>*/}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchTag}
            onChange={handleTagChange}
            defaultValue="all"
          >
            <MenuItem value="all">全てを表示</MenuItem>
            {tags.map(tag => (
              <MenuItem value={tag}>{tag}</MenuItem>

            ))}
          </Select>
        </FormControl>
        :
        <></>}
      {/* <SelectWorkspace /> */}
    </div>
  )

  const renderPageList = () => (
    isTagMode ?
      pageListsWithTag
      : <PageList pages={pages} withUpdate={withUpdate} />
  )

  return (
    <div className="User-Top">
      {props.top}

      {renderSelectTag()}

      {renderPageList()}

    </div>
  );
}

export default Home