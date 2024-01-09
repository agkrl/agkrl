for filename in $(ls);
do
    if [ $filename != "c.bash" ]
    then
      png="${filename%.png}.svg"
      convert ${filename} ${png}
    fi
done
