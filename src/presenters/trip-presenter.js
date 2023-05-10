import {render, replace} from '../framework/render.js';
import ContentView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import SortView from '../view/sort-view.js';

import TripEventsListView from '../view/trip-events-list-view.js';

export default class TripPresenter {
  #listView = new TripEventsListView();

  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];

  constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = [...this.#pointsModel.points];
  }

  init() {
    render(new SortView(), this.#tripContainer);
    render(this.#listView, this.#tripContainer);

    this.#points.forEach((point) => {
      this.#renderTask({
        point,
        pointDestination: this.#destinationsModel.getById(point.destination),
        pointOffer: this.#offersModel.getByType(point.type)
      });
    });
  }

  #renderTask({point, pointDestination, pointOffer}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new ContentView({
      point,
      pointDestination,
      pointOffer,
      onEditClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointComponent = new EditPointView({
      point,
      pointDestination,
      pointOffer,
      onFormSubmit: () => {
        replaceEditFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onCloseEditClick: () => {
        replaceEditFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEditForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, this.#listView.element);
  }


}
