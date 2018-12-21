import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  ListItemSecondaryAction,
  ListItem,
  ListItemText,
  List,
  Switch
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  paper: { padding: theme.spacing.unit * 2 },
  tracado: { textDecorationLine: 'line-through' }
});

class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      tarefa: '',
      tarefas: [],
      tarefasTodas: [],

      checkedB: false
    };
  }

  componentWillMount() {
    /* const { tarefas, tarefasTodas } = this.state;
    this.setState({ tarefasTodas: tarefas });*/
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleToggle = input => e => {
    let tarefa = input;

    tarefa.concluida = !tarefa.concluida;
    this.handleCommentEdit(tarefa.key, !tarefa.concluida);
  };

  handleCommentEdit = (key, checked) => {
    this.setState({
      tarefas: this.state.tarefas.map(el =>
        el.key === key ? Object.assign({}, el, { checked: checked }) : el
      )
    });
  };

  handleChangeLista = name => event => {
    const { tarefas, tarefasTodas } = this.state;

    this.setState({ [name]: event.target.checked });
    console.log(event.target.checked);
    /*
    if (event.target.checked) {
       this.setState({ tarefas: tarefasTodas }); 
    } else {
      let tarefasExibe = tarefas.filter(tarefa => tarefa.concluida == true);
      this.setState({ tarefas: tarefasExibe });
    }*/
  };

  addItem = e => {
    e.preventDefault();
    if (this.state.tarefa == '') {
      return;
    }
    let tarefa = {
      descricao: this.state.tarefa,
      key: Date.now(),
      concluida: false,
      dt_evento: new Date(),
      tipoEvento: 5,
      status: 3
    };
    this.setState({
      tarefas: [...this.state.tarefas, tarefa]
    });
    this.setState({
      tarefa: ''
    });

    this.enviaEvento(tarefa);
  };

  enviaEvento(tarefa) {
    let { empresa } = this.props;

    const data = { evento: tarefa };

    fetch(`https://uce.intranet.bb.com.br/api-timeline/v1/eventos`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-access-token': window.sessionStorage.token,
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())

      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    const { classes } = this.props;
    const { eventos } = this.props;
    console.log(eventos);
    const { tarefa, tarefas, checked, checkedB } = this.state;

    return (
      <div>
        <Grid
          className={classNames(classes.container)}
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
          sm={12}
          md={12}
          lg={12}
        >
          <Grid item lg={6}>
            <Paper className={classes.paper}>
              <Typography variant="subtitle1">Pendências BB</Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedB}
                    onChange={this.handleChangeLista('checkedB')}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="Exibe concluídas"
              />
              <List dense>
                {tarefas.map(tarefa => (
                  <ListItem key={tarefa.key} button>
                    <ListItemText
                      primary={tarefa.descricao}
                      className={
                        tarefa.concluida ? classes.tracado : classes.naoTracado
                      }
                    />
                    <ListItemSecondaryAction>
                      <Checkbox onClick={this.handleToggle(tarefa)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <TextField
                label="Tarefa"
                placeholder="Tarefa"
                multiline
                className={classes.inputs}
                margin="normal"
                fullWidth
                value={tarefa}
                onChange={this.handleChange('tarefa')}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                onClick={this.addItem}
              >
                Adicionar Tarefa
              </Button>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper>
              <Typography variant="h5">Pendências Empresa</Typography>
              <Divider />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ToDo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ToDo);
