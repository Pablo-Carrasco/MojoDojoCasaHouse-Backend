from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json
import sys
import requests

def scraper_selenium_movies(url, region, cinema, id_cinema):
    data = []
    
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('--ignore-certificate-errors')
    chrome_options.add_argument('--incognito')

    driver = webdriver.Chrome(options=chrome_options)

    driver.get(url)

    time.sleep(3)

    cookies_button = driver.find_element(By.XPATH, '//*[@id="modal-cookies-template"]/div[1]/div/button')
    cookies_button.click()
    time.sleep(2)

    change_cinema_button = driver.find_element(By.XPATH, '//*[@id="modal-theatre-select"]/div/div[2]/div[2]/button[2]')
    change_cinema_button.click()
    time.sleep(2)

    select_region = driver.find_element(By.XPATH, '//*[@id="modal-theatre-select"]/div/div[2]/div/div/div[1]/select')
    for option in select_region.find_elements(By.TAG_NAME, 'option'):
        if option.text == region:
            option.click()
            time.sleep(1)
            break
        
    select_cinema = driver.find_element(By.XPATH, '//*[@id="modal-theatre-select"]/div/div[2]/div/div/div[2]/select')
    for option in select_cinema.find_elements(By.TAG_NAME, 'option'):
        if option.text == cinema:
            option.click()
            time.sleep(1)
            break

    accept_button = driver.find_element(By.XPATH, '//*[@id="modal-theatre-select"]/div/div[2]/div/div/div[3]/button')
    accept_button.click()
    time.sleep(3)

    days_button = driver.find_element(By.XPATH, '//*[@id="billboard_days"]')
    for li in days_button.find_elements(By.TAG_NAME, 'li'):
        # print(li.text)
        li.click()
        time.sleep(2)
        info_movies = scraper_bs4_movies(driver, cinema, id_cinema)
        for new_show in info_movies:
            data.append(new_show)

    driver.quit()
    return data

def scraper_bs4_movies(driver, cinema, id_cinema):
    info_movies = []
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    body_contents = soup.body
    container_content = body_contents.find(id="movie-show-container")
    data_days = container_content.find(class_="billboard-days")
    date = data_days.find(class_="active").find("h5").text
    container_movies = container_content.find(class_="movies-container")
    data_movies = container_movies.find_all(class_="movie-box row")
    for data_movie in data_movies:
        image_container = data_movie.find(class_="default-background center-background")
        url_image = str(image_container.find("a").get("style")).split('"')[1]
        data_title = data_movie.find(class_="movie-title")
        title = data_title.find_all("a")[1].text
        url_movie = data_title.find_all("a")[1].get("href")
        boxs_movie_format = data_movie.find_all(class_="box-movie-format")
        movie_format(boxs_movie_format, info_movies, id_cinema, date, title, url_image, url_movie)
    return info_movies
    
def movie_format(boxs_movie_format, info_movies, id_cinema, date, title, url_image, url_movie):
    for box_movie_format in boxs_movie_format:
        data_format = box_movie_format.find(class_="movie-format")
        # language = data_format.find(class_="movie-lenguaje").text
        data_version = data_format.find(class_="movie-version").find_all("span")
        # version = list(map(lambda a: str(str(a).split('"')[1].split("-")[1].strip()), data_version))
        data_seats = data_format.find(class_="movie-seats").find_all("span")
        data_seats.pop(0)
        # seats = list(map(lambda a: str(str(a).split('"')[1].split("-")[1].strip()), data_seats))
        data_time = box_movie_format.find(class_="movie-times")
        schedules = list(map(lambda a: str(a.text).replace("\t","").replace("\n", ""), data_time.find_all("button")))
        for schedule in schedules:
            new_show = {
                "title": title.strip(),
                "schedule": schedule,
                "link_to_show": url_movie,
                "link_to_picture": url_image,
                "id_cinema": id_cinema,
                "date": date_formatter(date)
            }
            info_movies.append(new_show)

def date_formatter(date):
    date_data = date.split(" ")
    day_number = date_data[0]
    month_text = date_data[1]
    year = date_data[2]
    if month_text == "JAN.":
        month = "01"
    elif month_text == "FEB.":
        month = "02"
    elif month_text == "MAR.":
        month = "03"
    elif month_text == "APR.":
        month = "04"
    elif month_text == "MAY.":
        month = "05"
    elif month_text == "JUN.":
        month = "06"
    elif month_text == "JUL.":
        month = "07"
    elif month_text == "AUG.":
        month = "08"
    elif month_text == "SEP.":
        month = "09"
    elif month_text == "OCT.":
        month = "10"
    elif month_text == "NOV.":
        month = "11"
    elif month_text == "DEC.":
        month = "12"
    return f'{year}-{month}-{day_number}'

def main(url, region, cinema_name, cinema_id):
    movies_data = scraper_selenium_movies(url, region, cinema_name, cinema_id)
    # print("|||||||||||||||||||||")
    # print(output)
    backend_endpoint = "http://localhost:3000/api/movies"
    response = requests.post(backend_endpoint, json=movies_data)

    # print(response.text)
    
## INICIO código ejecutable

if __name__ == "__main__":
    cinema_name = sys.argv[1]
    cinema_id = sys.argv[2]
    url = "https://www.cinemark.cl/?tag=513"
    region = 'SANTIAGO'
    main(url, region, cinema_name, cinema_id)
