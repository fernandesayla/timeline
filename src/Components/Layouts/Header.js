import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {  Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard'
import Kanban from './Kanban'
import Timeline from './Timeline'
import FormEvent from './FormEvent';
import Busca from "./busca/Busca";
import FormControl from '@material-ui/core/FormControl';
import logo from '../../bancodobrasil.png';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
 //https://uce.intranet.bb.com.br/timeline/?visao=1&bloco_origem=4&cnpj=05.721.752/0001-65&cod_pais=23&mci=509277368&nm_prefixo_redex=FRANKFURT%20ALEMANHA&nome=ADIDAS%20AG&pais=ALEMANHA&prefixo_redex=720&tabela_origem=2

const theme = createMuiTheme({
    palette: {
      primary:{
        main: '#1565c0',
        dark: '#0d47a1'
      }
      
    },
  });
 
let counterDep = 0;
function createDependencia(nome, uor, envolvimento, prefixo) {
  counterDep += 1;
  return { id: counterDep, nome, uor, envolvimento, prefixo };
}


let counter = 0;
function createFuncionario(nome, chave, tipo, prefixo) {
  counter += 1;
  return { id: counter, nome, chave, tipo, prefixo };
}


let counterEmp = 0;
function createEmpresa(nome, mci, cod_pais, pais, tabela_origem, bloco_origem, envolvimento) {
  counterEmp += 1;
  return { id: counterEmp, nome, mci, cod_pais, pais, tabela_origem, bloco_origem, envolvimento };
}

function TabContainer(props) {
    return (
        <React.Fragment>
         {props.children}
        </React.Fragment>
    );
  }
 
class Header extends React.Component {
    
    constructor(props) {
        super(props);
        
    this.state = {
        value: 0,
        open: false,
        visao: 1,
        url: 'https://uce.intranet.bb.com.br/api-timeline/v1/empresas/',
        urlEventos: 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa/',
        eventos: [],
        empresa: {},
        descricao: '',
        currentLocale: 'pt-br',
        dt_evento: new Date(),
        funcionario: {},
        funcionarios: [],
        envolvimento: 1,
        empresas: [],
        envolvimentoEmpresa: 1,
        dependencias: [],
        envolvimentoDependencia: 1,
        tipoEvento: 1,
        status: 1,
        comentario: '',
        eventoId: undefined 

        
      };
      this.getEventos = this.getEventos.bind(this);
      this.setEventos = this.setEventos.bind(this)
      this.setEvento = this.setEvento.bind(this)
      this.handleChangeSelect = this.handleChangeSelect.bind(this);
      this.setSelectedDate = this.setSelectedDate.bind(this);

    }

    setSelectedDate = date => {

       
        this.setState({ dt_evento: date });
    };
   
    componentWillMount() {
     
        this.setState({visao: window.sessionStorage.visao||1}) 

        let empresa =  window.sessionStorage.objetoBusca?JSON.parse(window.sessionStorage.objetoBusca):{}
       

        let params = new URLSearchParams(this.props.location.search);

        if(parseInt(params.get("visao"), 10))   {
             empresa = this.handleParams(params)
        } 
       
        
        if(empresa=={})
            return
         
            
        this.setState({empresa: empresa}) 
        this.getEventos(empresa)
        
      }
      
      handleParams(params){
        
            this.handleChangeSelect(1)
            let empresaParams =  createEmpresa(params.get("nome"),parseInt(params.get("mci"), 10),parseInt(params.get("cod_pais"), 10), params.get("pais") ,parseInt(params.get("tabela_origem")) ,parseInt(params.get("bloco_origem")))
            return   empresaParams
      }

 
      handleChangeSelect(option)  {
  
        switch(option) {
            case 1:
                   this.setState({'url': 'https://uce.intranet.bb.com.br/api-timeline/v1/empresas/',
                   'urlEventos': 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/empresa/'})  
                break;
            case 2:
                    this.setState({'url': 'https://uce.intranet.bb.com.br/api-timeline/v1/dependencias/',
                    'urlEventos': 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/dependencias/'})     
                break;
            case 3:
                     this.setState({'url': 'https://uce.intranet.bb.com.br/api-timeline/v1/funcionarios/',
                     'urlEventos': 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/funcionarios/'})     
                break;
            default:
                   this.setState({'url':  'https://uce.intranet.bb.com.br/api-timeline/v1/empresa/',
                   'urlEventos': 'https://uce.intranet.bb.com.br/api-timeline/v1/eventos/'})   
                break;
        }
      }
    

    myCallbackBusca = (empresaChild) =>{

        salvarUltimaPesaquisaCache(1, empresaChild)
        this.setState({empresa:empresaChild})

        this.getEventos(empresaChild) 
    }
    handleChangeTab = (event, value) => {
        this.setState({ value : value });
    };
 
    myCallbackOpenDialog = (open) => {
        this.setState(  { open: open });
    } 
        
    setEventos = (data) => {
        this.setState({ eventos: data });
    }

          
    clearEvento= ()=>{
        
        this.setState({ eventoId: undefined });
        this.setState({ descricao: '' });
        this.setState({dt_create: new Date })
        this.setState({dt_evento:  new Date })
        this.setState({tipoEvento: 1})
        this.setState({status: 1 })
        this.setState({ dependencias:[] });
        this.setState({ funcionarios: []});
        this.setState({ empresas: []})
    }
    setEvento = (data) => {
          
        this.setState({ eventoId: data.id });
        this.setState({ descricao: data.descricao });
        this.setState({dt_create: data.dt_create })
        this.setState({dt_evento: data.dt_evento })
        this.setState({tipoEvento: data.tipo_envolvimento_id })
        this.setState({status: data.status })
 
       
       
        data.dependencias.forEach(element => {
            
            this.setState({ dependencias: [...this.state.dependencias, 
                {id: element.id,   nome:  element.nome, uor: element.uor, envolvimento: element.tipoEnvolvimentoId, prefixo: element.prefixo}] });

        }); 

        data.funcionarios.forEach(element => {
          
            
            this.setState({ funcionarios: [...this.state.funcionarios,
                  {id: element.id, nome: element.nome, chave: element.chaveFunci, envolvimento:  element.descricao,  prefixo: element.prefixo }]});
           
        }); 
       
        data.empresas.forEach(element => {

            this.setState({ empresas: [...this.state.empresas, {id: element.id, 
                                                                nome: element.nome, 
                                                                mci: element.mci,  
                                                                cod_pais: element.cod_pais, 
                                                                pais: element.pais, 
                                                                tabela_origem: element.tabela_origem, 
                                                                bloco_origem: element.bloco_origem,
                                                                envolvimento: element.tipoEnvolvimentoId  } ]})
        }); 
      
    } 
 


    myCallbackDependencia = (dependenciaChild) => {
        this.setState({ dependencias: [...this.state.dependencias, createDependencia(dependenciaChild.nome, dependenciaChild.uor, this.state.envolvimentoDependencia, dependenciaChild.prefixo)] });
      }
      myCallback = (funcionariosChild) => {
        this.setState({ funcionarios: [...this.state.funcionarios, createFuncionario(funcionariosChild.NM_FUN, funcionariosChild.CD_USU, this.state.envolvimento, funcionariosChild.CD_PRF_DEPE_ATU)] });
      }
    
      myCallbackEmpresas = (empresaDataChild) => {
        this.setState({ empresas: [...this.state.empresas, createEmpresa(empresaDataChild.nome, empresaDataChild.mci, empresaDataChild.cod_pais, empresaDataChild.pais, empresaDataChild.tabela_origem, empresaDataChild.bloco_origem, this.state.envolvimentoEmpresa)] });
      }
    
      handleChange = input => e => {
     
        this.setState({ [input]: e.target.value });
      };

    handleChangeInput = event => {
        this.setState({ [event.target.name]: event.target.value });
        this.handleChangeSelect(event.target.value);
    };

    getEventos = (object) => {

    

        fetch(this.state.urlEventos , {
            method: "POST",
            body: JSON.stringify(object)  ,
            headers: {
            "x-access-token": window.sessionStorage.token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json' 
            
            }
        })
        .then(response => response.json())
        .then(data => this.setState({ eventos: data }))
        .catch(function (err) { console.error(err); });
    }

    render() {
        
        const { classes } = this.props;
        const { value, url , eventos,  currentLocale }  = this.state;
        const {  descricao, tipoEvento, status, dt_evento, envolvimento, empresas, envolvimentoEmpresa, dependencias, envolvimentoDependencia, empresa , funcionarios, eventoId}   = this.state;
        const evento = {  descricao, tipoEvento, status, dt_evento, envolvimento, empresas, envolvimentoEmpresa, dependencias, envolvimentoDependencia, funcionarios , eventoId } 

        const ScrollableTabsButtonAuto = (
            <div className={classes.rootTabs}>
                  
            <Tabs
              value={value}
              onChange={this.handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto" >

              <Tab label="Timeline" component={Link} to="/timeline" />
              <Tab label="Dashboard"   component={Link} to="/timeline/dashboard" />   
              <Tab label="Kanban"   component={Link} to="/timeline/kanban" />    />
            
            </Tabs>
            <TabContainer fullWidth  >
                <div className={classes.dadosEmpresa} >
            <Typography variant="h5">   
                 {this.state.empresa.nome}

             </Typography>
             <Typography variant="subtitle1" color="textSecondary">
                 {this.state.empresa.pais}
            </Typography>
             </div>
                <Route path="/timeline"   render={(props) => 
                <Timeline empresa={empresa}  eventos={eventos} setEventos={this.setEventos} myCallbackOpenDialog={this.myCallbackOpenDialog}  setEvento={this.setEvento}  {...props} />  } />   
                <Route path="/timeline/dashboard" component={Dashboard}     /> 
                <Route path="/timeline/kanban" component={Kanban}   />
            </TabContainer> 
        </div>
        )

        return (
            <div >
                <MuiThemeProvider theme={theme}>
                <AppBar position="static" color="primary"  >
                    <Toolbar>   
                        <img style={{margin: 8}} src={logo}/>
                        <Typography  variant="h6" color="inherit"  noWrap>
                            UCE Timeline
                        </Typography>
                    </Toolbar>
                    < Toolbar   className={classes.subBar} >
                     {/*  <FormControl fullWidth  className={classes.formControl}   >
                            <InputLabel htmlFor="visao-simple">Visão</InputLabel>
                            <Select
                                value={this.state.visao}
                                onChange={this.handleChangeInput}
                                inputProps={{
                                name: 'visao',
                                id: 'visao-simple',
                                style: {
                                    width: 200,
                                }
                                }} >
                                <MenuItem value={1}>Empresa</MenuItem>
                                <MenuItem value={2}>Dependências</MenuItem>
                                <MenuItem value={3}>Funcionários</MenuItem>
                            </Select>
                            </FormControl> */} 
                        <FormControl fullWidth    >
                        <Busca  url={url} addSuggestion={this.myCallbackBusca} />
                        </FormControl>
                    </Toolbar>
                    {ScrollableTabsButtonAuto}
                </AppBar>
                
             <FormEvent 
                open={this.state.open}   
                myCallbackOpenDialog={this.myCallbackOpenDialog}  
                myCallbackDependencia={this.myCallbackDependencia}
                myCallback={this.myCallback}
                myCallbackEmpresas={this.myCallbackEmpresas}

                setSelectedDate={this.setSelectedDate}
                empresas={this.state.empresas}
                funcionarios={this.state.funcionarios}
                dependencias={this.state.dependencias}
                clearEvento={this.clearEvento}
                handleChange={this.handleChange}
                setEventos={this.setEventos}
                evento={evento} 

                    />
           
             </MuiThemeProvider>               
                  
            </div>

        );
    }
}
function salvarUltimaPesaquisaCache(visao, objeto){

    window.sessionStorage.visao = visao
    window.sessionStorage.objetoBusca = JSON.stringify(objeto)
}

const styles = theme => ({
   
    rootTabs: {
      
      backgroundColor: theme.palette.background.paper,
    },
    textField: {
      margin: theme.spacing.unit,

    },
    
    cssUnderline: {
      '&:after': {
        borderBottomColor: 'white'
      },
  },
  subBar:{
      backgroundColor: '#0d47a1'
  },

  formControl:{
      width:200,
      margin: theme.spacing.unit,
  },
  dadosEmpresa:{
      padding: theme.spacing.unit,
  }
   

})

Header.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(Header);
