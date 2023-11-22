from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException
from bs4 import BeautifulSoup, Comment
import time
import json
import sys
import requests

def scraper_info_movies(url, city, selected_cinema, selected_id_cinema):
    data = []
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--incognito')

    driver = webdriver.Chrome(options=chrome_options)

    driver.get(url)

    time.sleep(10)

    select_city = driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div[1]/select')
    for option in select_city.find_elements(By.TAG_NAME, 'option'):
        if option.text == city:
            option.click()
            break

    cinemas_container = driver.find_element(By.CLASS_NAME, 'cinemas--list')
    cinemas_list = cinemas_container.find_elements(By.CLASS_NAME, 'cinemas--list--item')
    for cinema in cinemas_list:
        cinema_name = cinema.find_element(By.CLASS_NAME, 'cinema--title').text
        if cinema_name == selected_cinema:
            button_cinema = cinema.find_element(By.CLASS_NAME, 'cinema--image-wrapper')
            button_cinema.click()
            time.sleep(6)
            break
    
    select_date = driver.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/div[2]/div[3]/select')
    date_option = WebDriverWait(driver, 10).until(EC.visibility_of(select_date))
    options = date_option.find_elements(By.TAG_NAME, 'option')

    for i in range(len(options)):
        try:
            print(f'Este es la url antes del option: {driver.current_url}')
            option = WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, f'/html/body/div[1]/div/div/div[2]/div[2]/div[3]/select/option[{i + 1}]')))
            option_text = option.text
            print(f'Pasamos el option: {option_text}')
            if option_text != "Ayer":
                option.click()
                time.sleep(4)
                date = scraper_bs4_date(driver)
                day_text = option_text
                info_general_per_day = scraper_bs4_movies(driver, url, city, selected_cinema, selected_id_cinema, day_text, date)
                if len(info_general_per_day) > 0:
                    for info_show in info_general_per_day:
                        data.append(info_show) 
        except StaleElementReferenceException:
            # Handle the exception if the element becomes stale
            print("Element is stale")
            pass
    
    driver.quit()
    return data

    
def scraper_bs4_date(driver):
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    body_contents = soup.body
    select_content = body_contents.find(class_="dropdown city-cinema-day-select--drop-down date--cinemas dropdown_large")
    selected_day = select_content.find(class_="dropdown--label-container").text
    data_days = select_content.find_all(class_="dropdown--select-option")
    date = None
    for day in data_days:
        if day.text == selected_day:
            date = str(day).split('"')[3].split("T")[0].strip()
            break
    return date
    
def scraper_bs4_movies(driver, url, city, selected_cinema, selected_id_cinema, day_text, date):
    info_general = []
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    body_contents = soup.body
    container_content = body_contents.find(class_="movies-list-schedules cinemas-details--movie-list")
    container_movies = container_content.find(class_="movies-list-schedules--item-container")
    data_movies = container_movies.find_all(class_="movies-list-schedules--large-item")
    for data_movie in data_movies:
        info_movie = data_movie.find(class_="movies-list-schedules--large-item-content-wrapper")
        title_container = info_movie.find(class_="movies-list-schedules--large-movie-description-title")        
        title = "".join(elem for elem in title_container.find_all(string=True, recursive=False) if not isinstance(elem, Comment))
        label = info_movie.find(class_="movie-info-schedules-label").text
        if  label == "Estreno" or label == "":
            data_movie_format_container = data_movie.find(class_="cinema-showcases--details schedules")
            data_movie_format_general = data_movie_format_container.find_all(class_="sessions-details cinema-showcases--sessions-details")
            for data_movie_format in data_movie_format_general:
                data_format = data_movie_format.find(class_="sessions-details--formats")
                dimension = data_format.find(class_="sessions-details--formats-dimension").text
                data_theatres = data_format.find_all(class_="sessions-details--formats-theather")
                theatres = list(map(lambda a: str(a.text).strip(), data_theatres))
                language = data_format.find(class_="sessions-details--formats-language").text
                data_schedules = data_movie_format.find_all(class_="showtime-selector sessions-details--session-item")
                # schedules = list(map(lambda a: str(a.text).strip(), data_schedules))
                schedules_links = []
                if len(data_schedules) > 0:
                    for schedule_container in data_schedules:
                        button_container = schedule_container.find(class_="button showtime-selector--link")
                        new_url_purchase, new_image_link = get_url_purchase(url, city, selected_cinema, day_text, title, dimension, theatres, language, button_container.text)
                        schedules_links.append([date, button_container.text, new_url_purchase])
                        new_info = {
                            "title": title.strip(),
                            "schedule": button_container.text,
                            "link_to_show": new_url_purchase,
                            "link_to_picture": new_image_link,
                            "id_cinema": selected_id_cinema,
                            "date": date
                        }
                        info_general.append(new_info)
                        print(f'Se acaba de agregar el siguiente show {new_info}')
                else:
                    pass
        else:
            pass
    return info_general
                

def get_url_purchase(url, city, selected_cinema, selected_day, selected_title, selected_dimension, selected_theatre, selected_language, selected_schedule):
    chrome_options2 = Options()
    chrome_options2.add_argument("--headless")
    chrome_options2.add_argument('--ignore-certificate-errors')
    chrome_options2.add_argument('--incognito')

    driver2 = webdriver.Chrome(options=chrome_options2)
    driver2.get(url)
    time.sleep(10)

    select_city = driver2.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div[1]/div[1]/select')
    for option in select_city.find_elements(By.TAG_NAME, 'option'):
        if option.text == city:
            option.click()
            break

    cinemas_container = driver2.find_element(By.CLASS_NAME, 'cinemas--list')
    cinemas_list = cinemas_container.find_elements(By.CLASS_NAME, 'cinemas--list--item')
    for cinema in cinemas_list:
        cinema_name = cinema.find_element(By.CLASS_NAME, 'cinema--title').text
        if cinema_name == selected_cinema:
            button_cinema = cinema.find_element(By.CLASS_NAME, 'cinema--image-wrapper')
            button_cinema.click()
            time.sleep(6)
            break
    
    select_date = driver2.find_element(By.XPATH, '/html/body/div[1]/div/div/div[2]/div[2]/div[3]/select')
    for option in select_date.find_elements(By.TAG_NAME, 'option'):
        if option.text == selected_day:
            option.click()
            time.sleep(2)
            break
        
    
    soup = BeautifulSoup(driver2.page_source, 'html.parser')
    body_contents = soup.body
    container_content = body_contents.find(class_="movies-list-schedules cinemas-details--movie-list")
    container_movies = container_content.find(class_="movies-list-schedules--item-container")
    data_movies = container_movies.find_all(class_="movies-list-schedules--large-item")
    for data_movie in data_movies:
        info_movie = data_movie.find(class_="movies-list-schedules--large-item-content-wrapper")
        title_container = info_movie.find(class_="movies-list-schedules--large-movie-description-title")        
        title = "".join(elem for elem in title_container.find_all(string=True, recursive=False) if not isinstance(elem, Comment))
        if title != selected_title:
            pass
        else:
            image_container = info_movie.find(class_="movie-info-schedules")
            image_info = image_container.find(class_="image-loader image-loader_loaded movie-info-schedules-image image-loader_fixed")
            image_data = image_info.find("img")
            image_url = image_data['src']
            data_movie_format_container = data_movie.find(class_="cinema-showcases--details schedules")
            data_movie_format_general = data_movie_format_container.find_all(class_="sessions-details cinema-showcases--sessions-details")
            for data_movie_format in data_movie_format_general:
                data_format = data_movie_format.find(class_="sessions-details--formats")
                dimension = data_format.find(class_="sessions-details--formats-dimension").text
                data_theatres = data_format.find_all(class_="sessions-details--formats-theather")
                theatres = list(map(lambda a: str(a.text).strip(), data_theatres))
                language = data_format.find(class_="sessions-details--formats-language").text
                data_schedules = data_movie_format.find_all(class_="showtime-selector sessions-details--session-item")
                if dimension == selected_dimension and theatres == selected_theatre and language == selected_language:
                    for schedule_container in data_schedules:                        
                        button_container = schedule_container.find(class_="button showtime-selector--link")
                        if button_container.text == selected_schedule:
                            button_id = button_container['id']
                            selected_button = driver2.find_element(By.ID, button_id)
                            selected_button.click()
                            time.sleep(2)
                            
                            container_alerts = driver2.find_elements(By.CLASS_NAME, 'alert--call-to-actions-container')

                            if len(container_alerts) > 0:
                                container_alert = container_alerts[0]
                                buttons_alert = container_alert.find_elements(By.TAG_NAME, 'button')
                                buttons_alert[1].click()
                                # Realiza acciones con el elemento de la alerta
                                print("Alerta presente")
                            else:
                                print("No hay alerta presente, continuar con el flujo del programa")
                            
                            time.sleep(6)
                            
                            url_purchase = driver2.current_url  
                            driver2.quit()
                            
                            return url_purchase, image_url
                    break
                else:
                    pass
            break
    driver2.quit()

def main(url, city, cinema_name, cinema_id):
    current_data = scraper_info_movies(url, city, cinema_name, cinema_id)
    # print(current_data)
    backend_endpoint = "http://localhost:3000/api/movies"
    response = requests.post(backend_endpoint, json=current_data)

    # print(response.text)
    
## INICIO código ejecutable
if __name__ == "__main__":
    cinema_name = sys.argv[1]
    cinema_id = sys.argv[2]
    url = 'https://www.cineplanet.cl/cines'
    city = 'Santiago'
    main(url, city, cinema_name, cinema_id)



