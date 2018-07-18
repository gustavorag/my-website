import React, { Component } from 'react';
import Utils from '../utils/Utils';
import Draggable from '../modules/Draggable';
import AppCartridge from './AppCartridge';

//Importing component style
import '../styles/CartridgeShelf.css';

const APP_CARTRIDGE_WIDTH_BIG = 100;
const APP_CARTRIDGE_WIDTH_SMALL = 100;
const APP_CARTRIDGE_MARGIN_BIG = 60;
const APP_CARTRIDGE_MARGIN_SMALL = 30;
const SHELF_SIDE_PADDING_BIG = 40;
const SHELF_SIDE_PADDING_SMALL = 50;
const DEFAUL_FIRST_PAGE = 0;

class CartridgeShelf extends Component {

  constructor(props){
    super(props);

    //Bidings
    this.updateState = this.updateState.bind(this);
    this.getAppsToShow = this.getAppsToShow.bind(this);
    this.changePage = this.changePage.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.SHELF_DIV_ID = "react-cartridge-shelf";
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.state = this.updateState(DEFAUL_FIRST_PAGE);


  }

  /*
  The self state controls the shelf width related to the window size.
  The amount of cartridges displayed is calculated using the window size and cartridge width.
  This calculation intends to make the shelf responsive to different devices.
  */
  updateState(actualPage){

    var state = {
      windowWidth: window.innerWidth,
      cartridgeStyle: {
        width: APP_CARTRIDGE_WIDTH_BIG,
        marginRight: APP_CARTRIDGE_MARGIN_BIG,
        marginLeft: APP_CARTRIDGE_MARGIN_BIG,
      },
      shelfStyle: {
        paddingRight: SHELF_SIDE_PADDING_BIG,
        paddingLeft: SHELF_SIDE_PADDING_BIG,
      },
      /*
      Pagination controls the displaying of cartridges on the shelf based on
      window size (width)
      */
      pagination: {
        itemPerPage: 0,
        totalPages: 0,
        /*
        page's number follows the array standards: index 0 for the first element,
        index 1 for the second element and so on.
        */
        actualPage: actualPage,
      }
    }

    //Default value;
    var itemPerPage = 5;
    var totalPages = 1;

    //For very small displays such as smartphones, the size of margins and paddings varies.
    if(state.windowWidth < 480){
      state.cartridgeStyle.width  = APP_CARTRIDGE_WIDTH_SMALL;
      state.cartridgeStyle.marginRight = APP_CARTRIDGE_MARGIN_SMALL;
      state.cartridgeStyle.marginLeft = APP_CARTRIDGE_MARGIN_SMALL;
      state.shelfStyle.paddingRight = SHELF_SIDE_PADDING_SMALL;
      state.shelfStyle.paddingLeft = SHELF_SIDE_PADDING_SMALL;
    }

    var cartridgeMargins = (state.cartridgeStyle.marginRight + state.cartridgeStyle.marginLeft);
    var paddings = (state.shelfStyle.paddingRight + state.shelfStyle.paddingLeft);
    var availableWidth = (state.windowWidth - paddings);

    /*
    The pagination (amount of cartridges per page, displaying of next and back button) is
    done by dividing the size of the shelf by the number of cartridges times cartridges' width.
    */
    itemPerPage = (availableWidth / (state.cartridgeStyle.width + cartridgeMargins ));
    itemPerPage = Math.floor(itemPerPage);

    totalPages = this.props.apps.length / itemPerPage;
    totalPages = Math.ceil(totalPages);

    state.pagination.itemPerPage = itemPerPage;
    state.pagination.totalPages = totalPages;

    return state;
  }

  /*
  Change page receives the increment factor. It can be positive, which means
  moving to the next page, or negative, which means moving to the previous page.
  */
  changePage(increment){

    var newPage = this.state.pagination.actualPage + increment;
    if(newPage < 0) {
      newPage = 0;
    }
    if(newPage >= this.state.totalPages){
      newPage = this.state.totalPages -1;
    }

    this.setState({
      pagination: {
        itemPerPage: this.state.pagination.itemPerPage,
        totalPages: this.state.pagination.totalPages,
        actualPage: newPage,
      }
    })
  }

  /*
  This method retrieves the apps to be shown on the shelf, based on actual page
  and how many apps per page.
  */
  getAppsToShow(){

    var itemsToShow = [];

    var init = this.state.pagination.actualPage * this.state.pagination.itemPerPage;
    var ending = init + this.state.pagination.itemPerPage;
    ending = ending >= this.props.apps.length ? this.props.apps.length : ending;

    for(var count = init; count < ending; count++){
      itemsToShow.push(this.props.apps[count]);
    }
    return itemsToShow;
  }

  updateWindowDimensions() {
    this.setState(this.updateState(this.state.pagination.actualPage));
  }

  handleDragEnd(mouse, item){
    this.props.onCartridgeRelease(mouse, item);
  }

  //Registring event handler for window resizing. It is important to change
  //how the shelf will display the cartridges.
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  render(){

    var itemsToShow = this.getAppsToShow();

    //Button should be shown only if there is pagination.
    var leftNavigationArrow = (this.state.pagination.actualPage) >  0 ?
    (
      <div onClick={ ()=>{ this.changePage(-1) } }>
        <i className="fas fa-caret-square-left leftNavigationArrow"></i>
      </div>
    )
    :
    null;

    var rightNavigationArrow = (this.state.pagination.actualPage) <  this.state.pagination.totalPages-1 ?
    (
      <div onClick={ ()=>{ this.changePage(+1) } }>
        <i className="fas fa-caret-square-right rightNavigationArrow"></i>
      </div>
    )
    :
    null

    return this.props.mouseTrack ?
    (
      <div id={this.SHELF_DIV_ID} style={this.state.shelfStyle}
        className={Utils.isArrayEmpty(this.props.apps) ? " collapsed" : ""}>
        {leftNavigationArrow}
        {
          Utils.isArrayEmpty(this.props.apps) ? null : (
            <ul>
              {
                itemsToShow.map(
                  (item)=>{
                    if(!item.isLoaded){
                      return(
                        <li key={item.id} style={this.state.cartridgeStyle}>
                          <Draggable mouseTrackerId={item.id}
                            cursorClass={{grab: "cartridge-grab", grabbing: "cartridge-grabbing"}}
                            mouseTrack={this.props.mouseTrack}
                            draggableItem={item}
                            >
                            <AppCartridge app={item} mouse={this.props.mouse}/>
                          </Draggable>
                        </li>
                      )
                    }else{
                      return null;
                    }
                  }
                )
              }
            </ul>
          )
        }
        {rightNavigationArrow}
      </div>
    )
    :
    null
  }
}

export default CartridgeShelf;
