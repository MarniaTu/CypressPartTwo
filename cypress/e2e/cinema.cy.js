import login from "../fixtures/login.json";
import selectors from "../fixtures/selectors.json";

describe('cinema tickets service', () => {
  
  context('main page', () => {
    beforeEach(() => {

      cy.visit('http://qamid.tmweb.ru/client/index.php');
  
    });

    it('main page title', () => {

      cy.contains('Идёмвкино').should('be.visible');
    });
  
    it('7 days calendar visibility', () => {
  
      cy.get(selectors.main_page_calendar_days).should('have.length', 7);
    });
  
    it('first movie title', () => {
  
      cy.contains('"Сталкер(1979)"').should('be.visible');
    });
  
  
    it('first movie hall title', () => {
  
      cy.get(selectors.main_page_first_movie_hall_title).should('have.text', 'ЗалЗал90');
    });
    
  
    it('second movie first hall title', () => {
  
      cy.get(selectors.main_page_second_movie_first_hall_title).should('have.text', 'Зал 2');
    });
  
  
    it('second movie second hall title', () => {
  
      cy.get(selectors.main_page_second_movie_second_hall_title).should('have.text', 'Красивый зал');
    });
  
    it('third movie hall title', () => {
  
      cy.get(selectors.main_page_third_movie_hall_title).should('have.text', 'Зал 1');
    });


  });

  context('admin login',() => {

    beforeEach(() => {

      cy.visit('http://qamid.tmweb.ru/admin');
  
    });

    it('admin page subtitle visibility', () => {

      cy.contains('Администраторррская').should('be.visible');
    });


    it('login title visibility', () => {

      cy.get(selectors.admin_page_authorization_title).should('have.text', 'Авторизация');
    });


    it('admin login success', () => {

      cy.admin_login(login[0].email, login[0].password);
  
      cy.get(selectors.admin_page_title_after_login).should('have.text', 'Управление залами');
  
    });

    it('admin login failure wrong email', () => {

      cy.admin_login(login[1].email, login[1].password);

      cy.get(selectors.admin_login_email_field).then((elements) => {

        expect(elements[0].checkValidity()).to.be.false;
      });

    });

    it('admin login failure wrong password', () => {

      cy.admin_login(login[2].email, login[2].password);

      cy.get(selectors.admin_login_password_field).then((elements) => {
  
        expect(elements[1].checkValidity()).to.be.false;
      });
      
    });

    it('admin login failure empty email', () => {

      cy.admin_login(login[3].email, login[3].password);

      cy.get(selectors.admin_login_email_field).then((elements) => {

        expect(elements[0].checkValidity()).to.be.false;
        expect(elements[0].validationMessage).to.be.eql('Заполните это поле.');
      });

    });

    it('admin login failure empty password', () => {

      cy.admin_login(login[4].email, login[4].password);

      cy.get(selectors.admin_login_password_field).then((elements) => {
  
        expect(elements[0].checkValidity()).to.be.false;
        expect(elements[0].validationMessage).to.be.eql('Заполните это поле.');
      });

    });
    
  });

  context('book tickets to available hall', () => {
    beforeEach(() => {

      cy.visit('http://qamid.tmweb.ru/admin');
      cy.admin_login(login[0].email, login[0].password);
  
    });

    afterEach(() => {

      cy.visit('http://qamid.tmweb.ru/admin');
      
      cy.get(selectors.admin_page_choose_hall_5_for_sales_activation).click();
      cy.contains('Закрыть продажу билетов').click();

    })

    it('book ticket to hall 5', () => {

      cy.contains('Доступные залы:').should('be.visible');
      cy.get(selectors.admin_page_item_1_in_available_halls_list).should('have.text', '"зал 5"').should('be.visible');
      cy.get(selectors.admin_page_movie_title_for_hall_5).contains('Микки маус').should('be.visible');

      cy.get(selectors.admin_page_choose_hall_5_for_sales_activation).click();
      cy.contains('Открыть продажу билетов').click();
      cy.get(selectors.admin_page_announce_sales_open).should('have.text', 'Продажа билетов открыта!!!').should('be.visible');

      cy.visit('http://qamid.tmweb.ru/client/index.php');
      cy.contains('"зал 5"').should('be.visible');
      cy.get(selectors.main_page_third_day_in_calendar).click();
      cy.contains('12:00').click();
      cy.get(selectors.hall_5_row_6_seat_7).click();
      cy.contains('Забронировать').click();

      cy.get(selectors.tickets_confimation_film_title).should('have.text', 'На фильм: Микки маус');
      cy.get(selectors.tickets_confirmation_hall_title).should('have.text', 'В зале: "зал 5"');
      cy.get(selectors.tickets_confirmation_movie_start_time).should('have.text', 'Начало сеанса: 12:00');
      

    });

  })
  
});