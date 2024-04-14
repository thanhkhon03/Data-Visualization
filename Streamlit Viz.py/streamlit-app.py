import streamlit as st
import matplotlib.pyplot as plt 
import os 
import numpy as np
import pandas as pd

st.title("Project Matplotlib + Streamlit")
st.subheader("Ảnh 1:")
st.image("Bóng.jpg")

st.subheader("Ảnh 2:")
st.image("Milan.jpg")    

st.subheader("Video:")
st.video("nike.mp4")

st.subheader("Ấn 'Yes' để tiếp tục kéo xuống")
st.checkbox('yes')

st.sidebar.subheader("Nhấp click phía dưới để xem Video")
 
if st.sidebar.button("Click"):
    os.system("start nike.mp4")
    
st.sidebar.radio('Pick your gender',['Male','Female'])
st.sidebar.subheader('Nhập Tên Của Bạn')
st.sidebar.text_input("Your Name")
st.sidebar.selectbox('Choose a Year',['1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'])
st.sidebar.multiselect('Choose Genre',['Drama','Adventure', 'Action', 'Comedy','Biography','Crime','Family','Sci-Fi','Music','Western','Thriller','History','Mystery','Sport','Musical'])
st.select_slider('Pick a mark', ['Bad', 'Good', 'Excellent'])
st.sidebar.slider('Pick a number',0,50)
st.sidebar.time_input('Time')
st.sidebar.date_input('Date')
st.sidebar.text_area('Description')
st.file_uploader('Donate Image')
st.sidebar.color_picker('Choose your Favorite color')

rand =np.random.normal(1,2, size=20)
fig, ax = plt.subplots()
ax.hist(rand, bins=15)
st.pyplot(fig)

df = pd.DataFrame(
    np.random.randn(10,2),
    columns=['x','y'])
st.line_chart(df)

df = pd.DataFrame(
    np.random.randn(10,2),
    columns=['x','y']   )
st.bar_chart(df)

movies_data = pd.read_csv("https://raw.githubusercontent.com/nv-thang/Data-Visualization-Course/main/movies.csv")
movies_data.info()
movies_data.dropna(axis=0, how='any', inplace=True, ignore_index=False)
st.write("""Average Movie Budget, Grouped by Genre """)
avg_budget = movies_data.groupby('genre')['budget'].mean().round()
avg_budget = avg_budget.reset_index()
genre = avg_budget['genre']
avg_bud = avg_budget['budget']

fig = plt.figure(figsize = (19,10))

plt.bar(genre, avg_bud, color= 'maroon')
plt.xlabel('genre')
plt.ylabel('budget')
plt.title('Matplotlib Bar Chart Showing the Average \
    Budget of Movies in Each Genre')
st.pyplot(fig)
