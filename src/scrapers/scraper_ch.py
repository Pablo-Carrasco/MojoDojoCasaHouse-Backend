from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json
import sys
import requests
from datetime import datetime


def scraper_selenium_movies(url, city, cinema, id_cinema):
    data = []
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--incognito')

    driver = webdriver.Chrome(options=chrome_options)

    driver.get(url)

    time.sleep(3)

    select_city = driver.find_element(By.XPATH, '/html/body/form/div[4]/header/div[1]/div[2]/div/div[1]/div/div/select')
    for option in select_city.find_elements(By.TAG_NAME, 'option'):
        # print(option.text)
        if option.text == city:
            option.click()
            time.sleep(1)
            break
        
    select_cinema = driver.find_element(By.XPATH, '/html/body/form/div[4]/header/div[1]/div[2]/div/div[2]/div/div/select')
    for option in select_cinema.find_elements(By.TAG_NAME, 'option'):
        # print(option.text)
        if option.text == cinema:
            option.click()
            time.sleep(3)
            break


    days_button = driver.find_element(By.XPATH, '/html/body/form/div[4]/div[3]/section[2]/div/div/div/div/div[1]/div/div/div/select')
    for option in days_button.find_elements(By.TAG_NAME, 'option'):
        # print(option.get_attribute("value"))
        option.click()
        date = date_formatter(str(option.get_attribute("value")))
        # print("-----------FECHA----------")
        # print(option.text)
        # print(date)
        # print("--------------------------")
        time.sleep(2)
        info_movies = scraper_bs4_movies(driver, cinema, id_cinema, date)
        for new_show in info_movies:
            data.append(new_show)

    driver.quit()
    return data

def scraper_bs4_movies(driver, cinema, id_cinema, date):
    info_movies = []
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    body_contents = soup.body
    container_content = body_contents.find(class_="col7 listaCarteleraHorario")
    div_content = container_content.find_all("div")
    for div in div_content:
        if len(div["class"]) == 2 and div["class"][1] == "divComplejo":
            # print(div["class"])
            movies_container = div.find(class_="divFecha ng-scope")
            for article in movies_container.find_all("article"):
                # print(article.prettify())
                # figure_container = article.find("figure")
                # image_container = figure_container.find("img")
                title = article.find("figure").find("img")["alt"]
                url_image = article.find("figure").find("img")["src"]
                # print(title, url_image)
                for data_schedule in article.find_all("time"):
                    data = data_schedule.find("a")
                    schedule = data.text
                    url_purchase = data["href"]
                    # print(schedule, url_purchase)
                    new_show = {
                        "title": title,
                        "schedule": schedule,
                        "link_to_show": url_purchase,
                        "link_to_picture": url_image,
                        "id_cinema": id_cinema,
                        "date": date
                    }
                    info_movies.append(new_show)
    return info_movies
    
# def movie_format(boxs_movie_format, info_movies, id_cinema, date, title, url_image, url_movie):
#     for box_movie_format in boxs_movie_format:
#         data_format = box_movie_format.find(class_="movie-format")
#         language = data_format.find(class_="movie-lenguaje").text
#         data_version = data_format.find(class_="movie-version").find_all("span")
#         version = list(map(lambda a: str(str(a).split('"')[1].split("-")[1].strip()), data_version))
#         data_seats = data_format.find(class_="movie-seats").find_all("span")
#         data_seats.pop(0)
#         seats = list(map(lambda a: str(str(a).split('"')[1].split("-")[1].strip()), data_seats))
#         data_time = box_movie_format.find(class_="movie-times")
#         schedules = list(map(lambda a: str(a.text).replace("\t","").replace("\n", ""), data_time.find_all("button")))
#         print(f'{language} - {version} - {seats}')
#         print(schedules)
#         print(date_formatter(date))
#         for schedule in schedules:
#             new_show = {
#                 "title": title.strip(),
#                 "schedule": schedule,
#                 "link_to_show": url_movie,
#                 "link_to_picture": url_image,
#                 "id_cinema": id_cinema,
#                 "date": date_formatter(date)
#             }
#             info_movies.append(new_show)

def date_formatter(date):
    date_data = date.split(" ")
    day_number = date_data[0]
    month_text = date_data[1]
    year = datetime.now().year
    if month_text == "enero":
        month = "01"
    elif month_text == "febrero":
        month = "02"
    elif month_text == "marzo":
        month = "03"
    elif month_text == "abril":
        month = "04"
    elif month_text == "mayo":
        month = "05"
    elif month_text == "junio":
        month = "06"
    elif month_text == "julio":
        month = "07"
    elif month_text == "agosto":
        month = "08"
    elif month_text == "septiembre":
        month = "09"
    elif month_text == "octubre":
        month = "10"
    elif month_text == "noviembre":
        month = "11"
    elif month_text == "diciembre":
        month = "12"
    return f'{year}-{month}-{day_number}'

def main(url, city, cinema_name, cinema_id):
    movies_data = scraper_selenium_movies(url, city, cinema_name, cinema_id)
    backend_endpoint = "http://localhost:3000/api/movies"
    response = requests.post(backend_endpoint, json=movies_data)
    
## INICIO código ejecutable

if __name__ == "__main__":
    cinema_name = sys.argv[1]
    cinema_id = sys.argv[2]
    # cinema_name = 'Cinépolis Mallplaza Egaña'
    # cinema_name = 'Parque Arauco Premium Class'
    # cinema_id = 5
    url = "https://www.cinehoyts.cl/"
    city = 'Santiago Oriente'
    main(url, city, cinema_name, cinema_id)

