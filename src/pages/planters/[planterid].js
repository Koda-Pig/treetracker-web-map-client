import Box from '@mui/material/Box';
//import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { makeStyles } from '../../models/makeStyles';
import Typography from '@mui/material/Typography';
import log from 'loglevel';
//import Image from 'next/image';
import { useEffect, useState } from 'react';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

import Location from '../../components/common/Location';
import Time from '../../components/common/Time';
import FeaturedTreesSlider from '../../components/FeaturedTreesSlider';
import InformationCard1 from '../../components/InformationCard1';
import PageWrapper from '../../components/PageWrapper';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useMapContext } from '../../mapContext';
import * as utils from '../../models/utils';
import moment from 'moment';
import TreeSpeciesCard from 'components/TreeSpeciesCard';
import CustomCard from '../../components/common/CustomCard';


// make styles for component with material-ui
const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  badges: {
    marginTop: 8,
    '&>*': {
      marginRight: 8,
    },
  },
  title: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '36px',
    lineHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
  },
  title3: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '29px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
    marginTop: theme.spacing(10),
  },
  title4: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '29px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
    marginTop: theme.spacing(28),
  },
  treeSlider: {
    marginTop: theme.spacing(10),
  },
  divider: {
    marginLeft: theme.spacing(-10),
    marginRight: theme.spacing(-10),
    width: '100%',
  },
  title5: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '28px',
    lineHeight: '34px',
    display: 'flex',
    alignItems: 'center',
    color: '#474B4F',
  },
  text1: {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '20px',
    lineHeight: '28px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.04em',
    color: '#474B4F',
  },
}));

export default function Planter({ planter }) {
  const mapContext = useMapContext();

  const [isPlanterTab, setIsPlanterTab] = useState(true);

  const classes = useStyles();

  useEffect(() => {
    async function reload() {
      // manipulate the map
      const { map } = mapContext;
      if (map && planter) {
        // map.flyTo(tree.lat, tree.lon, 16);
        map.setFilters({
          userid: planter.id,
        });
        await map.loadInitialView();
        map.rerender();
      } else {
        log.warn('no data:', map, planter);
      }
    }
    reload();
  }, [mapContext.map]);

  function handleCardClick() {
    setIsPlanterTab(!isPlanterTab);
  }

  return (
    <PageWrapper className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {planter.first_name} {planter.last_name}
      </Typography>
      <Box className={classes.badges}>
        <VerifiedBadge verified={true} badgeName="Verified Planter" />
        <VerifiedBadge verified={false} badgeName="Seeking Orgs" />
      </Box>
      <Box className={classes.box1}>
        <Location entityLocation="Shirimatunda,Tanzania" />
        <Time date={moment(planter.created_time).toDate()} />
      </Box>
      <Box mt={1} />
      <Divider className={classes.divider} />
      {/* <Box
        style={{ height: '672px'  }}
        className={classes.imageContainer}
      >
        <Image
          src={planter.photo_url}
          layout="fill"
          objectPosition="center"
          objectFit="cover"
        />
      </Box> */}
      <Avatar
        src={planter.photo_url}
        variant="rounded"
        sx={{ width: '100%', height: '688px', borderRadius: 6, marginTop: 6 }}
      />
      <Grid container spacing={1}>
        <Grid item>
          <CustomCard
            handleClick={handleCardClick}
            icon={<ParkOutlinedIcon />}
            title="Trees Planted"
            text={planter.featuredTrees.total}
            disabled={isPlanterTab ? false : true}
          />
        </Grid>
        <Grid item>
          <Box width={8} />
        </Grid>
        <Grid item>
          <CustomCard
            handleClick={handleCardClick}
            icon={<GroupsOutlinedIcon />}
            title="Associated Organizations"
            text={planter.associatedOrganizations.total}
            disabled={!isPlanterTab ? false : true}
          />
        </Grid>
      </Grid>
      {isPlanterTab && (
        <>
          <Typography variant="h3" className={classes.title3}>
            Explore some trees planted by <strong>{planter.first_name}</strong>
          </Typography>
          <Box className={classes.treeSlider}>
            <FeaturedTreesSlider trees={planter.featuredTrees.trees} />
          </Box>
        </>
      )}
      {!isPlanterTab &&
        planter.associatedOrganizations.organizations.map((org) => (
          <div key={org.id}>
            <InformationCard1
              entityName={org.name}
              entityType={'Planting Organization'}
              buttonText={'Meet the Organization'}
              cardImageSrc={org?.logo_url}
              link={`/organizations/${org.id}`}
            />
          </div>
        ))}
      <Typography variant="h6" className={classes.title4}>
        Species of trees planted
      </Typography>
      <Box className={classes.speciesBox}>
        {planter.species.species.map((species) => (
          <TreeSpeciesCard
            key={species.id}
            name={species.name}
            scientificName={species.scientificName}
            count={species.count}
          />
        ))}
      </Box>
      <Box mt={10} />
      <Divider className={classes.divider} />
      <Box mt={20} />
      <Typography variant="h6" className={classes.title5}>
        About
      </Typography>
      <Box mt={7} />
      <Typography variant="body1" className={classes.text1}>
        {planter.about}
      </Typography>
      <Box mt={16} />
      <Typography variant="h6" className={classes.title5}>
        Mission
      </Typography>
      <Box mt={7} />
      <Typography variant="body1" className={classes.text1}>
        {planter.mission}
      </Typography>
      <Box mt={20} />
      <Divider className={classes.divider} />
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  log.warn('params:', params);
  log.warn('host:', process.env.NEXT_PUBLIC_API_NEW);

  const props = {};
  {
    const url = `/planters/${params.planterid}`;
    log.warn('url:', url);

    const planter = await utils.requestAPI(url);
    log.warn('response:', planter);
    props.planter = planter;
  }

  {
    const { featured_trees, associated_organizations, species } =
      props.planter.links;
    props.planter.featuredTrees = await utils.requestAPI(featured_trees);
    props.planter.associatedOrganizations = await utils.requestAPI(
      associated_organizations,
    );
    props.planter.species = await utils.requestAPI(species);
  }

  return {
    props,
  };
}
