import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { trackPromise } from "react-promise-tracker"


import UserInfoContext from "../context";
import Transition from "../Transition";
import { PageDataSource } from "../Main/ProductionApi";

const pageDataSource = new PageDataSource();

const useStyles = makeStyles((theme) => ({
  root: {
    //margin: '',
    padding: '2px 4px',
    display: 'flex',
    justify: 'flex-end',
    alignItems: 'center',
    justifyContent: 'right',
    //width: 400,

  },
  formControl: {
    margin: theme.spacing(),
    //marginLeft: 'auto',
    float: 'right',
    minWidth: 120,
  },
  card: {
    //maxWidth: 2000,
    //width: "23%",
    width: '20vw',
    maxHeight: "20%",
    margin: theme.spacing(1),
    //padding: theme.spacing(2),
  },
  media: {
    //height: 140,
    paddingTop: '56.25%'
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));



export default function PageLink(props) {
  const [state, setState] = React.useState({
    url: "",
    title: "",
    to: "",
    isLoaded: false,
    isLoading: false
  })
  // const [url, setUrl] = useState("");
  // const [title, setTitle] = useState("");
  const { userInfo } = React.useContext(UserInfoContext);
  const page = props.page;
  const classes = useStyles();

  const handleClick = () => {
    setState({...state,isLoading:true});
    pageDataSource.getPage(page.id)
      .then(res => {
        if (res.statusText == "OK") {
          res.json()
            .then(page => {
              // console.log("getPage", page.page);
              setState({ to: `/${userInfo.id}/${page.page.id}`, isLoaded: true,isLoading:false });
              // props.onClose();
            })
        } else {
          // ここにページが読み込めなかったときの処理
        }
      });
  }






  return (
    <>
      <Transition to={state.to} ok={state.isLoaded} isLoading={state.isLoading}>

      </Transition>
      <Card className={classes.card}>
        <CardActionArea onClick={handleClick}>
          <CardMedia
            className={classes.media}
            //component="img"
            image={page.img}
            title="サムネ"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {page.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {page.url}
            メモの最初の1~2個{page.body}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}