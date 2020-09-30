import AppBar from '../../components/AppBar'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LabelIcon from '@material-ui/icons/Label';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import LinkIcon from '@material-ui/icons/Link';
import { GetStaticProps, GetStaticPaths } from 'next'
import db_ops from '../../server/helpers/db_ops'
import ErrorPage from 'next/error'
import CreateIcon from '@material-ui/icons/Create';
import Chip from '@material-ui/core/Chip';
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  icon_container: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 5
  },
  grid_container: {
    padding: 12
  },
  responsive: {
    maxWidth: '100%',
    height: 'auto',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Image(props: any) {
  const router = useRouter()

  if (router.isFallback) {
    return <ErrorPage statusCode={404} />
  }
  if (props.err) {
    return <ErrorPage statusCode={404} />
  }
  const classes = useStyles();


  const Tags = props.tags.map((tag: string) => <Chip label={tag} key={tag} className={classes.chip} component="a" href={`/search?q=${tag}`} clickable />);
  return (
    <div className={classes.root}>
      <AppBar />
      <div className={classes.grid_container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.paper}> <img className={classes.responsive} src={`/images/${props.filename}`} /></Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
              <div className={classes.icon_container}>
                <CreateIcon />
                <p>&nbsp;Author: {props.author}</p>
              </div>
              <div className={classes.icon_container}>
                <AspectRatioIcon />
                <p>&nbsp;Resoltuion: {props.width}x{props.height} {props.size}MB</p>
              </div>
              <div className={classes.icon_container}>
                <CalendarTodayIcon />
                <p>&nbsp;Date: {props.date}</p>
              </div>
              <div className={classes.icon_container}>
                <LinkIcon />
              &nbsp;<a href={props.derpi_link} target="_blank" rel="noreferrer">Depri Link</a>
              </div>
              <div className={classes.icon_container}>
                <LinkIcon />
              &nbsp;<a href={props.source_link} target="_blank" rel="noreferrer">Source</a>
              </div>
              <div className={classes.icon_container}>
                <LinkIcon />
              &nbsp;<a href={props.similar_by_tags_link} target="_blank" rel="noreferrer">Similar by tags</a>
              </div>
              <div className={classes.icon_container}>
                <LinkIcon />
              &nbsp;<a href={props.similar_by_color_link} target="_blank" rel="noreferrer">Similar by color</a>
              </div>
              {((props.upscaled)?(
                <div className={classes.icon_container}>
                <LinkIcon />
              &nbsp;<a href={props.upscaled} target="_blank" rel="noreferrer">Upscaled version</a>
              </div>
                ):null)}
              <div className={classes.icon_container}>
                <LabelIcon />
                <p>&nbsp;Tags:</p>
                {Tags}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}


export const getStaticProps: GetStaticProps = async (context) => {
  if (context.params?.id) {
    const img = await db_ops.image_ops.find_image_by_id(parseInt((context.params.id as string)))
    if (img.length === 1) {
      const date = new Date(img[0].created_at)
      const date_str = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
      const upscaled = (img[0].tags.includes('upscaled')?(`/upscaled/${img[0].id}`):null)
      return {
        props: {
          filename: `${img[0].id}.${img[0].file_ext}`,
          width: img[0].width,
          height: img[0].height,
          size: (img[0].size / (10 ** 6)).toFixed(2),
          author: img[0].author,
          tags: img[0].tags,
          derpi_link: img[0].derpi_link,
          source_link: img[0].source_url,
          date: date_str,
          similar_by_tags_link:`/similar_by_tags/${img[0].id}`,
          similar_by_color_link:`/similar_by_color/${img[0].id}`,
          is_upscaled:upscaled
        },
        revalidate: 5*60 //5 min
      }
    }
  }
  return {
    props: {err: true},
    revalidate: 5*60 //5 min
  }

}

export const getStaticPaths: GetStaticPaths = async () => {
  const images = await db_ops.image_ops.get_all_images()
  const paths = images.map((image) => ({ params: { id: image.id.toString() } }))
  return {
    paths: paths,
    fallback: true
  };

}



// const Image = () => {
//   const router = useRouter()
//   const { id } = router.query

//   return (
//   <div>
// <p>Post: {id}</p>
//   </div>

//   )
// }

// export default Image